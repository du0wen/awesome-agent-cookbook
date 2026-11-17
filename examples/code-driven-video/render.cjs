// Step 5: freeze time, shoot frame by frame.
// usage:
//   NODE_PATH=$(npm root -g) node render.cjs --fps 30 --workers 4        # full render -> frames/
//   NODE_PATH=$(npm root -g) node render.cjs --stills 1.2,5,9.8          # review stills -> stills/
const puppeteer = require('puppeteer');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const fps = Number(arg('--fps', 30));
const workers = Number(arg('--workers', 4));
const stills = arg('--stills', null);

async function openPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
  await page.goto(pathToFileURL(path.resolve('index.html')).href, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  return page;
}
const shot = async (page, t, file) => {
  await page.evaluate(x => window.__seek(x), t);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1920, height: 1080 }, optimizeForSpeed: true });
};

// One browser per worker: background tabs in a shared browser never fire requestAnimationFrame,
// so __seek's paint wait would hang. The flags below disable background throttling as a second guard.
const launch = () => puppeteer.launch({
  headless: true,
  args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
});

(async () => {
  const browser = await launch();
  const browsers = [browser];
  const first = await openPage(browser);
  const duration = await first.evaluate(() => window.__duration);

  if (stills) {
    fs.mkdirSync('stills', { recursive: true });
    for (const t of stills.split(',').map(Number)) await shot(first, t, `stills/t_${t.toFixed(2)}.png`);
    console.log(`wrote ${stills.split(',').length} stills`);
  } else {
    fs.rmSync('frames', { recursive: true, force: true });
    fs.mkdirSync('frames', { recursive: true });
    const total = Math.ceil(duration * fps);
    const extra = await Promise.all(Array.from({ length: workers - 1 }, launch));
    browsers.push(...extra);
    const pages = [first, ...(await Promise.all(extra.map(openPage)))];
    const t0 = process.hrtime.bigint();
    let done = 0;
    await Promise.all(pages.map(async (page, w) => {
      for (let i = w; i < total; i += workers) {                 // interleaved shards
        await shot(page, i / fps, `frames/${String(i).padStart(6, '0')}.png`);
        if (++done % 300 === 0) console.log(`${done}/${total}`);
      }
    }));
    console.log(`rendered ${total} frames in ${(Number(process.hrtime.bigint() - t0) / 1e9).toFixed(1)}s`);
  }
  await Promise.all(browsers.map(b => b.close()));
})();
