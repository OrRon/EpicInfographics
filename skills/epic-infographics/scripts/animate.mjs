#!/usr/bin/env node
// Render an animated HTML infographic to MP4 or GIF, deterministically.
//
// Usage:
//   node scripts/animate.mjs input.html output.mp4 [--preset name] [--fps N]
//        [--duration S] [--hold S] [--scale N] [--sheet out.png]
//        [--width N] [--height N]
//
// The page's CSS animations are paused and scrubbed to exact timestamps via
// the Web Animations API, one screenshot per frame, then ffmpeg assembles the
// frames. No wall-clock recording, so every render of the same file is
// pixel-identical — the same idea Remotion uses, without leaving HTML.
//
// Output format comes from the extension: .mp4 (H.264) or .gif (palette-
// optimized, capped at 15fps / 720px wide so files stay postable).
//
// --duration  overrides the detected timeline length (needed only when every
//             animation is infinite, e.g. pure ambient loops)
// --hold      seconds to freeze on the finished frame (default 1; gives a
//             looping GIF a beat where the graphic is readable)
// --sheet     also write a 4×2 contact sheet PNG of evenly spaced frames —
//             this is what you LOOK at during review, since you cannot watch
//             the video itself
// --scale     device scale factor (default 1; video rarely needs retina)
//
// Requires ffmpeg on PATH (or set the FFMPEG env var to the binary):
//   macOS: brew install ffmpeg   ·   Debian/Ubuntu: apt install ffmpeg
//   Windows: winget install ffmpeg

import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve, join, extname } from 'node:path';
import { mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const PRESETS = {
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
  og: { width: 1200, height: 630 },
  a4: { width: 1240, height: 1754 },
  tall: { width: 1080, height: 'auto' },
};

function parseArgs(argv) {
  const args = { fps: 30, hold: 1, scale: 1 };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--preset') args.preset = argv[++i];
    else if (a === '--width') args.width = Number(argv[++i]);
    else if (a === '--height') { const v = argv[++i]; args.height = v === 'auto' ? 'auto' : Number(v); }
    else if (a === '--fps') args.fps = Number(argv[++i]);
    else if (a === '--duration') args.duration = Number(argv[++i]);
    else if (a === '--hold') args.hold = Number(argv[++i]);
    else if (a === '--scale') args.scale = Number(argv[++i]);
    else if (a === '--sheet') args.sheet = argv[++i];
    else if (a.startsWith('--')) fail(`Unknown flag: ${a}`);
    else positional.push(a);
  }
  [args.input, args.output] = positional;
  return args;
}

function fail(msg) {
  console.error(`animate.mjs: ${msg}`);
  console.error('Usage: node scripts/animate.mjs input.html output.mp4|output.gif [--preset square|story|wide|og|a4|tall] [--fps N] [--duration S] [--hold S] [--scale N] [--sheet out.png]');
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args.output) fail('need an input .html and an output .mp4 or .gif');
const format = extname(args.output).toLowerCase();
if (format !== '.mp4' && format !== '.gif') fail(`output must end in .mp4 or .gif, got "${args.output}"`);

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
if (spawnSync(FFMPEG, ['-version'], { stdio: 'ignore' }).error) {
  fail('ffmpeg not found — install it (macOS: brew install ffmpeg · Debian/Ubuntu: apt install ffmpeg · Windows: winget install ffmpeg) or point the FFMPEG env var at the binary');
}

let { width, height } = args.preset
  ? PRESETS[args.preset] ?? fail(`unknown preset "${args.preset}" (have: ${Object.keys(PRESETS).join(', ')})`)
  : {};
if (args.width) width = args.width;
if (args.height !== undefined) height = args.height;
width ??= 1080;
height ??= 1080;

const framesDir = mkdtempSync(join(tmpdir(), 'infographic-frames-'));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width, height: height === 'auto' ? 1080 : height },
    deviceScaleFactor: args.scale,
  });
  // Freeze every animation from the first style resolution. Without this, a
  // short entrance (e.g. 0.3s, fill backwards) finishes before the handles
  // are stashed below, drops out of getAnimations(), and can never be
  // scrubbed — it would show its end state from frame 0.
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { animation-play-state: paused !important; }';
    new MutationObserver((_, obs) => {
      if (document.head) { document.head.appendChild(style); obs.disconnect(); }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto(pathToFileURL(resolve(args.input)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150); // settle layout after font swap

  if (height === 'auto') {
    height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width, height });
  }

  // Freeze the timeline: grab every animation once, pause it, and from here
  // on drive currentTime by hand. Animations still in their delay phase are
  // included; getAnimations() would drop finished non-filling ones later,
  // which is why the handles are stashed now.
  const detected = await page.evaluate(() => {
    window.__anims = document.getAnimations();
    let end = 0;
    for (const a of window.__anims) {
      a.pause();
      const t = a.effect?.getComputedTiming();
      if (t && Number.isFinite(t.endTime)) end = Math.max(end, t.endTime);
    }
    return { count: window.__anims.length, endMs: end };
  });

  if (detected.count === 0) fail(`${args.input} has no CSS animations — nothing to animate (see references/motion.md)`);
  const durationS = args.duration ?? detected.endMs / 1000;
  if (durationS <= 0) fail(`every animation on the page is infinite — pass --duration to choose a capture length`);

  const moveFrames = Math.max(2, Math.round(durationS * args.fps) + 1);
  const holdFrames = Math.round(args.hold * args.fps);
  const pad = (n) => String(n).padStart(5, '0');

  for (let i = 0; i < moveFrames; i++) {
    const tMs = Math.min(i / args.fps, durationS) * 1000;
    await page.evaluate((t) => {
      for (const a of window.__anims) a.currentTime = t;
      return new Promise(requestAnimationFrame);
    }, tMs);
    await page.screenshot({
      path: join(framesDir, `frame${pad(i)}.png`),
      clip: { x: 0, y: 0, width, height },
    });
    if (i % args.fps === 0) console.log(`  frame ${i}/${moveFrames + holdFrames} (t=${(tMs / 1000).toFixed(2)}s)`);
  }
  // The hold is the last frame repeated — copy the file instead of re-shooting.
  const lastFrame = join(framesDir, `frame${pad(moveFrames - 1)}.png`);
  for (let i = 0; i < holdFrames; i++) {
    copyFileSync(lastFrame, join(framesDir, `frame${pad(moveFrames + i)}.png`));
  }
  const totalFrames = moveFrames + holdFrames;
  console.log(`  captured ${moveFrames} frames + ${holdFrames} hold = ${totalFrames} @ ${args.fps}fps (${(totalFrames / args.fps).toFixed(2)}s)`);

  const out = resolve(args.output);
  const input = ['-loglevel', 'error', '-framerate', String(args.fps), '-i', join(framesDir, 'frame%05d.png')];
  let ff;
  if (format === '.mp4') {
    // yuv420p needs even dimensions; the scale filter guards odd canvas sizes.
    ff = spawnSync(FFMPEG, ['-y', ...input,
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart',
      out], { stdio: ['ignore', 'ignore', 'inherit'] });
  } else {
    const gifFps = Math.min(args.fps, 15);
    const filters = `fps=${gifFps},scale='min(720,iw)':-2:flags=lanczos`;
    ff = spawnSync(FFMPEG, ['-y', ...input,
      '-filter_complex', `[0:v]${filters},split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
      '-loop', '0', out], { stdio: ['ignore', 'ignore', 'inherit'] });
  }
  if (ff.status !== 0) fail(`ffmpeg exited with ${ff.status}`);
  console.log(`rendered ${args.input} -> ${out} (${width}x${height} @${args.scale}x, ${(totalFrames / args.fps).toFixed(2)}s)`);

  if (args.sheet) {
    // 8 frames, first to last inclusive, tiled 4×2 — the reviewable artifact.
    const picks = Array.from({ length: 8 }, (_, k) => Math.round((k * (totalFrames - 1)) / 7));
    picks.forEach((f, k) => copyFileSync(join(framesDir, `frame${pad(f)}.png`), join(framesDir, `sheet${k}.png`)));
    const sheetOut = resolve(args.sheet);
    const sf = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', join(framesDir, 'sheet%d.png'),
      '-filter_complex', 'scale=480:-1,tile=4x2:padding=8:color=white', '-frames:v', '1', '-update', '1', sheetOut],
      { stdio: ['ignore', 'ignore', 'inherit'] });
    if (sf.status !== 0) fail(`ffmpeg (contact sheet) exited with ${sf.status}`);
    console.log(`contact sheet -> ${sheetOut} (frames ${picks.join(', ')} of ${totalFrames})`);
  }
} finally {
  await browser.close();
  rmSync(framesDir, { recursive: true, force: true });
}
