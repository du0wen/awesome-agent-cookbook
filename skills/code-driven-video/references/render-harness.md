# Minimal Deterministic Render Harness

A bare-bones capturer for pages that expose `window.__duration` and `window.__seek(t)`. Prefer HyperFrames or Remotion for production; use this when you want zero framework.

## Page contract (`index.html`)

```html
<canvas id="c" width="1920" height="1080"></canvas>
<script>
  // Seeded PRNG: never use Math.random() in scene code
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

  const ctx = document.getElementById('c').getContext('2d');
  window.__duration = 12; // seconds; derive from narration/song length in real projects

  const BOIL_RATE = 8; // hand-drawn "line boil" redraws per second, independent of output fps

  function render(t) {
    // Seed from scene time, not from frame index, so 24fps and 30fps renders look alike.
    // Use a fixed seed per element instead if lines should stay still.
    const rand = mulberry32(Math.floor(t * BOIL_RATE));
    ctx.fillStyle = '#fdf8ed';
    ctx.fillRect(0, 0, 1920, 1080);
    // ... draw scenes as pure functions of t ...
  }

  window.__seek = async (t) => {
    render(t);
    // Wait for two animation frames so the canvas is painted before capture
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  };
</script>
```

## Capturer (`render.mjs`)

```js
// usage: node render.mjs index.html 30 [startFrame] [endFrame]
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [, , page = 'index.html', fpsArg = '30', startArg, endArg] = process.argv;
const fps = Number(fpsArg);
mkdirSync('frames', { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const tab = await browser.newPage();
await tab.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await tab.goto(pathToFileURL(path.resolve(page)).href, { waitUntil: 'networkidle0' });
await tab.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
});

const duration = await tab.evaluate(() => window.__duration);
const total = Math.ceil(duration * fps);
const start = Number(startArg ?? 0);
const end = Math.min(Number(endArg ?? total), total);

for (let i = start; i < end; i++) {
  await tab.evaluate(t => window.__seek(t), i / fps);
  await tab.screenshot({ path: `frames/${String(i).padStart(6, '0')}.png` });
}
await browser.close();
console.log(`rendered frames ${start}-${end - 1} of ${total}`);
```

Shard long videos by running several processes over disjoint `[start, end)` ranges; the frame filenames line up automatically. Each process launches its own browser on purpose. Extra tabs in one browser are background tabs, which never fire `requestAnimationFrame`, and `__seek` would hang. If you must share a browser, launch it with `--disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows`.

For reference, a 53 s 1080p Canvas piece rendered 1,595 frames in about 18 s with 6 parallel browsers on an Apple Silicon Mac.

## Contact sheet for self-review

```bash
# 16 evenly spaced stills across the whole video, tiled 4x4, for the agent to inspect as an image
N=$(ls frames/*.png | wc -l); STEP=$(( (N + 15) / 16 ))
ffmpeg -y -framerate 30 -i frames/%06d.png \
  -vf "select='not(mod(n\,$STEP))',scale=480:-1,tile=4x4" -frames:v 1 contact.png
```

Also extract individual stills at every scene boundary and timing cue: one 4x4 sheet is too coarse to catch a one-frame glitch.

The double-`requestAnimationFrame` wait is best-effort. If stills show missing fonts or unfilled SVGs, switch to HyperFrames, which handles this with a custom capture path.

## Mux

```bash
# pad audio to the full video length instead of -shortest (narration often ends before the visuals)
DUR=12   # = window.__duration
ffmpeg -framerate 30 -i frames/%06d.png -i mix.wav -af apad -t $DUR \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -b:a 192k out.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,r_frame_rate,width,height out.mp4
```
