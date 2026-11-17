// Step 4: narration is the master clock.
// Synthesizes each line (Gemini TTS if GEMINI_API_KEY is set, else macOS `say`),
// measures durations, writes timeline.js (for the page) and mix.wav (narration + SFX).
// usage: node tts.mjs [--provider gemini|say]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

// --- env -------------------------------------------------------------------
function loadEnv(paths) {
  for (const p of paths) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}
loadEnv(['.env']);

const argProvider = process.argv.includes('--provider') ? process.argv[process.argv.indexOf('--provider') + 1] : null;
const provider = argProvider ?? (process.env.GEMINI_API_KEY ? 'gemini' : 'say');
console.log(`TTS provider: ${provider}`);

// --- providers ---------------------------------------------------------------
async function pickGeminiModel(key) {
  if (process.env.GEMINI_TTS_MODEL) return process.env.GEMINI_TTS_MODEL;
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', { headers: { 'x-goog-api-key': key } });
  if (!r.ok) throw new Error(`list models failed: ${r.status} ${await r.text()}`);
  const names = (await r.json()).models.map(m => m.name.replace('models/', '')).filter(n => /tts/i.test(n));
  if (!names.length) throw new Error('no TTS model visible to this key');
  // prefer flash, then highest version string
  names.sort((a, b) => (/flash/.test(b) - /flash/.test(a)) || b.localeCompare(a, undefined, { numeric: true }));
  console.log(`TTS models visible: ${names.join(', ')} -> using ${names[0]}`);
  return names[0];
}

let geminiModel;
async function synthGemini(text, outWav) {
  const key = process.env.GEMINI_API_KEY;
  geminiModel ??= await pickGeminiModel(key);
  const body = {
    contents: [{ parts: [{ text: `用亲切、清晰、语速适中的语气朗读：${text}` }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: process.env.GEMINI_VOICE ?? 'Kore' } } },
    },
  };
  for (let attempt = 1; ; attempt++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body),
    });
    if (r.ok) {
      const j = await r.json();
      const part = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!part) throw new Error(`no audio in response: ${JSON.stringify(j).slice(0, 300)}`);
      const pcm = `${outWav}.pcm`;
      writeFileSync(pcm, Buffer.from(part.inlineData.data, 'base64'));
      const rate = (part.inlineData.mimeType.match(/rate=(\d+)/) || [, '24000'])[1];
      sh('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', rate, '-ac', '1', '-i', pcm, outWav]);
      return;
    }
    if (r.status === 429 && attempt < 6) { // free-tier rate limit: back off and retry
      const wait = 10 * attempt;
      console.log(`  429 rate limited, retrying in ${wait}s`);
      await new Promise(res => setTimeout(res, wait * 1000));
      continue;
    }
    throw new Error(`Gemini TTS ${r.status}: ${(await r.text()).slice(0, 400)}`);
  }
}

function synthSay(text, outWav) {
  const aiff = `${outWav}.aiff`;
  sh('say', ['-v', process.env.SAY_VOICE ?? 'Tingting', '-r', '190', '-o', aiff, text]);
  sh('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, outWav]);
}

// --- main ----------------------------------------------------------------------
const TRIM = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse';
const LEAD = 0.5, LINE_GAP = 0.35, SCENE_TAIL = 0.8;

mkdirSync('audio', { recursive: true });
const { scenes } = JSON.parse(readFileSync('script.json', 'utf8'));
const lineFiles = [];
let cursor = LEAD, n = 0;
const timeline = { scenes: [] };

for (const sc of scenes) {
  const scene = { id: sc.id, start: cursor - (sc === scenes[0] ? LEAD : 0), lines: [] };
  for (const text of sc.lines) {
    const raw = `audio/raw_${String(n).padStart(2, '0')}.wav`;
    const wav = `audio/line_${String(n).padStart(2, '0')}.wav`;
    console.log(`[${n}] ${text}`);
    if (provider === 'gemini') await synthGemini(text, raw); else synthSay(text, raw);
    sh('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', TRIM, '-ar', '48000', '-ac', '1', wav]);
    const dur = parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]));
    scene.lines.push({ text, start: +cursor.toFixed(3), end: +(cursor + dur).toFixed(3) });
    lineFiles.push({ wav, start: cursor });
    cursor += dur + LINE_GAP;
    n++;
  }
  cursor += SCENE_TAIL - LINE_GAP;
  scene.end = +cursor.toFixed(3);
  timeline.scenes.push(scene);
}
timeline.duration = +(cursor + 0.3).toFixed(3);
writeFileSync('timeline.js', `window.TIMELINE = ${JSON.stringify(timeline, null, 2)};\n`);
console.log(`total duration ${timeline.duration}s`);

// SFX synthesized in code: a "pop" on every line cue, a "whoosh" on every scene wipe.
sh('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', "aevalsrc='0.5*sin(2*PI*(500+1400*t)*t)*exp(-28*t)':s=48000:d=0.18", 'audio/pop.wav']);
sh('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anoisesrc=d=0.55:c=pink:r=48000:a=0.5',
  '-af', 'bandpass=f=900:width_type=o:w=1.5,afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.25', 'audio/whoosh.wav']);

const inputs = [], filters = [], labels = [];
const add = (file, at, vol) => {
  const i = inputs.length / 2;
  inputs.push('-i', file);
  filters.push(`[${i}]adelay=${Math.round(at * 1000)}:all=1,volume=${vol}[a${i}]`);
  labels.push(`[a${i}]`);
};
for (const l of lineFiles) add(l.wav, l.start, 1.0);
for (const sc of timeline.scenes) for (const l of sc.lines) add('audio/pop.wav', l.start - 0.05, 0.35);
for (const sc of timeline.scenes.slice(0, -1)) add('audio/whoosh.wav', sc.end - 0.45, 0.5);

sh('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex',
  `${filters.join(';')};${labels.join('')}amix=inputs=${labels.length}:normalize=0,alimiter=limit=0.9[out]`,
  '-map', '[out]', '-ar', '48000', '-ac', '2', '-t', String(timeline.duration), 'mix.wav']);
console.log('wrote timeline.js, mix.wav');
