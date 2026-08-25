#!/usr/bin/env node
// Render an HTML infographic to PNG with headless Chromium (Playwright).
//
// Usage:
//   node scripts/render.mjs input.html output.png [--preset name] [--width N] [--height N|auto] [--scale N]
//
// Presets: square (1080x1080), story (1080x1920), wide (1920x1080),
//          og (1200x630), a4 (1240x1754), tall (1080xauto)
//
// --scale defaults to 2 (retina-crisp output; final pixels = size x scale).
// Height "auto" captures the full page height (long-form infographics).

import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const PRESETS = {
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
  og: { width: 1200, height: 630 },
  a4: { width: 1240, height: 1754 },
  tall: { width: 1080, height: 'auto' },
};

function parseArgs(argv) {
  const args = { scale: 2 };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--preset') args.preset = argv[++i];
    else if (a === '--width') args.width = Number(argv[++i]);
    else if (a === '--height') { const v = argv[++i]; args.height = v === 'auto' ? 'auto' : Number(v); }
    else if (a === '--scale') args.scale = Number(argv[++i]);
    else if (a.startsWith('--')) fail(`Unknown flag: ${a}`);
    else positional.push(a);
  }
  [args.input, args.output] = positional;
  return args;
}

function fail(msg) {
  console.error(`render.mjs: ${msg}`);
  console.error('Usage: node scripts/render.mjs input.html output.png [--preset square|story|wide|og|a4|tall] [--width N] [--height N|auto] [--scale N]');
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args.output) fail('need an input .html and an output .png');

let { width, height } = args.preset
  ? PRESETS[args.preset] ?? fail(`unknown preset "${args.preset}" (have: ${Object.keys(PRESETS).join(', ')})`)
  : {};
if (args.width) width = args.width;
if (args.height !== undefined) height = args.height;
width ??= 1080;
height ??= 1080;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width, height: height === 'auto' ? 1080 : height },
    deviceScaleFactor: args.scale,
  });
  await page.goto(pathToFileURL(resolve(args.input)).href, { waitUntil: 'networkidle' });
  // Fonts arriving after the screenshot is the classic blank/fallback-text bug.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150); // settle layout after font swap

  const out = resolve(args.output);
  if (height === 'auto') {
    await page.screenshot({ path: out, fullPage: true });
  } else {
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width, height } });
  }
  const finalH = height === 'auto' ? await page.evaluate(() => document.documentElement.scrollHeight) : height;
  console.log(`rendered ${args.input} -> ${out} (${width}x${finalH} @${args.scale}x = ${width * args.scale}x${finalH * args.scale}px)`);
} finally {
  await browser.close();
}
