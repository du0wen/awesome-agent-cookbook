---
name: code-driven-video
description: >-
  Use when the user asks an agent to make a video, animation, explainer,
  motion-design piece, music video, or narrated tutorial clip and the output
  must be a video file such as MP4 (e.g., "make a teaching video", "turn this
  article into a video", "render an MP4"). Not for in-app UI/CSS animations
  that never leave the browser. The agent cannot see or emit video,
  so it writes a deterministic program that draws frame N for any time t,
  captures frames with a headless browser (or Manim/Blender), and muxes them
  with narration/music via FFmpeg. Covers script & storyboard, visuals, timeline,
  audio-as-clock, frame capture, determinism rules, and screenshot self-review.
---

# Code-Driven Video

A language model outputs only text. Every "one-prompt video" is really a **program** the model wrote: given a timestamp, it draws that exact frame; a renderer captures thousands of frames and FFmpeg stitches them with audio into an MP4.

> **Core invariant**: `frame = f(t)`. For any time `t`, the picture must be uniquely determined. Everything in this skill exists to protect that property.

```
[1 Plan] ─> [2 Visuals] ─> [3 Motion] ─> [5a Capture] ─> [5b Mux] ─> MP4
   │                           ▲                             ▲
   └──────> [4 Audio] ─────────┴── timestamps ───────────────┘── audio track
             (narration = master clock)
```

Steps 1-3 are code the agent writes; 4-5 are external tools (TTS, headless Chrome, FFmpeg).

---

## Step 0: Clarify the Brief

A good request specifies five things. Fill gaps with sensible defaults and state them; ask only if the gap changes the whole approach.

| Item | Example | Default if missing |
|:---|:---|:---|
| **Source material** | Markdown article, outline, lyrics | Ask; nothing to make otherwise |
| **Rendering stack** | JS + Canvas, HTML + GSAP, Remotion, Manim | HTML/Canvas + GSAP-style seekable timeline |
| **Visual style** | Hand-drawn cartoon, flat, watercolor | Clean flat illustration, consistent palette |
| **Audio** | TTS provider + API key in `.env`, a song file | TTS narration + light SFX |
| **Content goal** | Hook in the opening, easy to follow, a takeaway | Hook → 3-5 key points → recap |

Reference prompt that works well:

> Make a teaching video. Source (Markdown) and API key (`.env`) are attached. Draw with JS + Canvas, hand-drawn cartoon style, with motion. Narrate with <TTS model>. Keep it easy to understand, open with a hook, leave viewers with a takeaway.

**Environment check** before writing code: Node.js, Chrome/Chromium (via Puppeteer or Playwright), and `ffmpeg` must be available. Verify with `node -v && ffmpeg -version`. Read API keys from `.env` and never print them.

---

## Step 1: Plan — Script, Then Storyboard

Write files, not just thoughts. Long multi-file jobs stay on track when the plan is on disk.

1. **`SCRIPT.md`**: the narration text, split into short spoken lines. Open with a hook, introduce one idea per scene, end with a recap or takeaway.
2. **`STORYBOARD.md`**: one entry per shot, covering what is shown, the narration line, approximate duration, and the transition into the next shot.
3. **Global style rules** at the top of the storyboard, which every shot must follow:
   - Fixed character/mascot design for the whole piece.
   - A palette arc (e.g., warm cream → space purple → alarm red → back to cream).
   - **Something is always moving.** No static frames.
   - Character expressions **ease** between states and never jump.
   - **Motivated transitions**: each cut is carried by an action (a bite to black, a fall, the camera flying through an eye).
   - Decide explicitly whether on-screen text is allowed. Text is a strength of code video (always spelled right), but music videos often ban it.

**Parallelize long pieces**: split the timeline into chapters and assign each to a subagent that writes one JS module covering `[tStart, tEnd)`. All modules import the shared style constants and character drawing functions.

---

## Step 2: Visuals — Draw Everything in Code

No stock assets are required. Pick the stack that fits:

| Need | Stack |
|:---|:---|
| Text, layout, UI-like explainers | HTML + CSS, SVG for icons/characters |
| Hand-drawn / generative / painterly | Canvas 2D or p5.js (+ a brush/watercolor library), with seeded jitter for a sketchy line |
| 3D scenes | three.js in a single HTML file |
| Math / code explanations | Manim (Python) renders its own frames |
| Modelled 3D, textures | Blender driven as a Python library |
| Photoreal shots | Generate stills with an image model, then place and animate them in the page |

Build reusable draw functions (`drawCharacter(ctx, pose, expression)`, `drawCard(ctx, text)`) instead of one-off drawing per scene.

---

## Step 3: Motion — Pin Every Action to a Time

The code needs a timetable: **at what second, which element, does what**. Two proven patterns:

- **Seekable timeline (GSAP-style)**: build a paused timeline and expose `seek(t)`.
  ```js
  tl.from(star, { scale: 0 }, 2);       // star pops in at t=2s
  tl.to(character, { x: 400 }, 3);      // character walks right at t=3s
  ```
- **Pure function of frame (Remotion/Canvas-style)**: `render(frame)` computes every element's position, opacity, and color from the frame number alone.
  ```js
  function render(t) {
    const p = ease(clamp((t - 2.0) / 0.4, 0, 1));
    drawStar(ctx, 200, 100, 40 * p);
  }
  ```

Either way, expose a single entry point for the capturer: `window.__duration` (seconds) and `window.__seek(t)`, which draws frame `t` and resolves once painting is complete.

- Derive `__duration` from the audio (narration/song length plus a short tail), not from a guess.
- **Avoid CSS `@keyframes`/`transition` and `<video>` playback.** They advance on wall-clock time and ignore `seek`. Drive all motion through the timeline. If CSS animations are unavoidable, pause them and set `animation.currentTime` via the Web Animations API inside `__seek`.

---

## Step 4: Audio — Narration Is the Master Clock

For narrated videos, **make the audio first, then align visuals to it.**

1. Send each script line to TTS. Prefer an endpoint that returns **character/word timestamps** (e.g., ElevenLabs "convert with timestamps").
2. If the TTS gives audio only, or you're working from an existing recording, run **Whisper** (or similar) to recover word-level timings.
3. Write `timings.json` (`[{ line, start, end, words: [{w, start, end}] }]`) and drive the timeline from it. When the narrator says "star", the star pops in on that frame.
4. Layer SFX and music on the same clock: a "pop" for element entrances, a "whoosh" for transitions, and background music **ducked** under speech.
   - Sources: an SFX library, an AI music/SFX model (prompted from brand/style rules), or audio synthesized in code.
5. **Music videos invert this**: the song is the clock, and visuals follow lyrics and beats. No TTS.

Concatenate narration segments into one `narration.wav` with known offsets so `timings.json` maps directly to the final timeline.

---

## Step 5: Capture & Mux — Freeze Time, Shoot Frame by Frame

**Never screen-record.** Browsers load fonts asynchronously, decode images lazily, and tie animation to the display refresh. Recording drops frames and differs between machines.

Instead, a headless browser **never presses play**:

1. Load the page; await `document.fonts.ready` and all images.
2. For `i = 0 … ceil(duration × fps) − 1`: call `__seek(i / fps)`, wait for paint, then screenshot to `frames/%06d.png`.
   - Known pitfall (HeyGen): capturing too fast grabs frames whose fonts haven't appeared or whose SVGs aren't filled yet. Waiting for paint in stock Chrome is best-effort. HeyGen's fix was a custom Chrome build on Linux that does layout, paint, and capture in one call. For DOM/SVG-heavy scenes, prefer HyperFrames over a home-made capturer. Canvas-only scenes are much less exposed.
3. Embedded video clips are **not** played in the browser. Pre-split them with FFmpeg into frame images and swap in the matching image per frame.
4. For long pieces, shard the frame range across several **browser processes**, one page each. Do not use several tabs in one browser: background tabs never fire `requestAnimationFrame`, so a paint wait inside `__seek` hangs until the protocol times out.
5. Mux with FFmpeg. Pad the audio to the video length. Don't use `-shortest`: a narration mix usually ends at the last spoken word and would cut off the video's closing seconds.
   ```bash
   ffmpeg -framerate 30 -i frames/%06d.png -i mix.wav -af apad -t <duration> \
     -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -b:a 192k out.mp4
   ```

Typical rates: 30 fps for explainers, 24 fps for a cinematic/MV feel.

A minimal Puppeteer capture harness is in [`references/render-harness.md`](./references/render-harness.md).

### Determinism Rules (Mandatory)

Scene code must never:

1. **Read the current time** (`Date.now()`, `performance.now()`, `requestAnimationFrame` timestamps). Use only the `t` passed to `__seek`.
2. **Use unseeded randomness**. Use a seeded PRNG (e.g., mulberry32) so hand-drawn jitter is identical on every render.
3. **Hit the network during render**. Inline or locally bundle fonts, images, and libraries.

If these rules hold, every frame depends only on its timestamp, so the same code renders the same video every time and parallel sharding is safe.

---

## Step 6: Self-Review via Stills

The agent cannot watch video, but it can look at images. Before the full render:

1. Render a **contact sheet**: one frame every 1-2 s, plus frames at every scene boundary and every timing cue.
2. Inspect them for: unloaded fonts / unfilled SVG, text overflow, off-canvas elements, overexposure (space scenes often wash out white, so ask for realistic color), static shots, palette drift, and character inconsistency.
3. Fix the code, re-render only the affected frames, and re-inspect. Then do the full render.
4. Verify the output: `ffprobe out.mp4` duration equals `__duration`, fps/resolution are correct, and an audio stream is present.
5. Spot-check determinism: re-render a few frame times separately and compare file hashes with the full render. They must be identical.

---

## Off-the-Shelf Tooling

You do not have to build the capturer yourself.

| Tool | Model | Notes |
|:---|:---|:---|
| **HyperFrames** (HeyGen, OSS) | Plain HTML + GSAP; Puppeteer + FFmpeg render | Agent skill pack: `npx skills add heygen-com/hyperframes`, render with `npx hyperframes render`. Flow: plan → HTML → seekable animation → assets → lint → preview → render. |
| **Remotion** | React components; each frame is a function of frame number | Official agent skills: `npx remotion skills add`. |

HeyGen reported that heavier React framework constraints made agent output more conservative and same-looking, and that plain HTML brought creativity back. Treat this as one team's data point, not a rule.

---

## When Not to Use Code Video (or Mix In a Video Model)

| | Code video | Pixel video models (Seedance, Kling, …) |
|:---|:---|:---|
| On-screen text | Always correct | Typos and garbled glyphs |
| Change one detail | Edit one line | Usually regenerate |
| Sync to narration | Frame-accurate | Hard to control |
| Photoreal, faces, animals | Weak: crude shapes up close | Strong |
| Re-render same input | Identical | Different every time |

**Hybrid**: act as orchestrator by calling a video model through MCP for photoreal shots, then cutting the returned clips into your own timeline (as pre-split frames). Or render code shots first and restyle them with a video-to-video model.

---

## Limits & Cost to Communicate Up Front

- Living things (people, animals) look like crude geometry up close.
- Quota-heavy: a ~3 min narrated short can consume a noticeable share of a weekly plan. Big single-file 3D scenes can hit the output-length limit, so split code into modules early.
- **Taste still needs a human.** Results improve markedly with an asset library and a style guide. Offer a contact sheet for approval before the full render.
- Requires a code-execution environment with Node.js, Chrome, and FFmpeg.

---

## Deliverables Checklist

- [ ] `SCRIPT.md`, `STORYBOARD.md` (with global style rules)
- [ ] Scene modules + shared style/character code exposing `__duration` / `__seek(t)`
- [ ] `narration.wav` (or song), `timings.json`, SFX/music, final `mix.wav`
- [ ] Contact-sheet stills reviewed and issues fixed
- [ ] `out.mp4` verified with `ffprobe`
- [ ] One-line summary: duration, fps, resolution, stack, and how to re-render
