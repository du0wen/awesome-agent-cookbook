# Storyboard — 「AI 是怎么用代码做视频的」(~50s, 1920x1080, 30fps)

## Global style rules
- Hand-drawn cartoon on cream paper (#fdf8ed); ink outlines with seeded "line boil" (8 Hz).
- Fixed mascot: 小星 — a yellow 5-point star with two dot eyes and a small smile. Same design in every scene.
- Palette arc: blue (scene 1–2) → purple (3–4) → orange (5) → back to green/cream (6).
- Something always moves. Expressions/scale changes ease, never jump.
- Transitions are motivated: 小星 bursts into a yellow circle that wipes to the next scene.
- On-screen text allowed (titles + subtitles); all text rendered with local system font.

## Shots (durations come from narration timings)
| # | Narration | Visual |
|---|---|---|
| 1 Hook | 你看到的这段视频，没有用任何视频模型。/ 它的每一帧，都是一段程序画出来的。 | Code editor types lines on the left; on line 2 小星 pops into the screen on the right and bounces. |
| 2 Frames | 视频，其实就是一串连续播放的图片。/ 每秒三十张，十秒就是三百张。 | Filmstrip scrolls; each cell shows 小星 a bit further along (flipbook). Frame counter ticks. Line 2: "10 秒 × 30 帧 = 300 张图". |
| 3 f(t) | 所以做视频，只要回答一个问题：/ 第 t 秒，画面长什么样？/ AI 写的，就是回答这个问题的程序。 | "画面 = f(t)" draws in; slider scrubs t back and forth, 小星 follows its path; line 3: code box arrows into f. |
| 4 Audio clock | 带旁白的视频，先做配音。/ 拿到每句话的时间，画面就卡着话走。 | Waveform + moving playhead; as it crosses markers, stars pop on cue. Title "配音 = 全片的时钟". |
| 5 Capture | 然后让浏览器冻结时间，一帧一帧截图，/ 最后用 FFmpeg，把图片和声音拼成视频。 | Browser window + camera flashes; frames drop into a filmstrip; line 2: strip + waveform feed an FFmpeg box → MP4 icon pops. |
| 6 Rules | 记住三条规矩：不读当前时间，/ 随机数固定种子，渲染时不联网。/ 这样每次渲染，结果都完全一样。 | Three cards pop in (clock / dice / no-wifi); line 3: check marks, 小星 jumps happily, "同样的代码 → 同样的视频". |
