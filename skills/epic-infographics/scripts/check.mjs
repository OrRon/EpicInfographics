#!/usr/bin/env node
// Preflight layout checker — run BEFORE rendering the PNG.
//
//   node scripts/check.mjs input.html [--preset name] [--width N] [--height N|auto] [--json]
//
// Loads the page in headless Chromium and verifies the layout mechanically:
//
//   ERRORS (must fix before rendering):
//     text-collision   two text elements paint over each other
//     text-clipped     text cut off by an overflow-hidden ancestor
//     text-offcanvas   text extends past the canvas edge
//     text-too-small   computed font size below the readable floor
//     hero-multiple    more than one element marked data-hero
//     canvas-overflow  page content is larger than the canvas
//
//   WARNINGS (fix, or justify in one line at review):
//     hero-missing     no element marked data-hero (emphasis checks skipped)
//     hero-weak        the data-hero element occupies <10% of the canvas
//     text-small       font size readable but tight (below comfort floor)
//     text-near-miss   two text elements almost touching
//
// Deliberate layering (e.g. a giant translucent numeral behind a headline) is
// waived by putting data-overlap-ok on either element. Waivers are counted and
// reported — use them sparingly and only after visually confirming legibility.
//
// Exit code: 1 if any errors, 0 otherwise (warnings never fail the run).

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

// Font-size floors in CSS px. Errors below MIN, warnings below COMFORT.
const FONT_MIN = 9;
const FONT_COMFORT = 12;

function parseArgs(argv) {
  const args = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--preset') args.preset = argv[++i];
    else if (a === '--width') args.width = Number(argv[++i]);
    else if (a === '--height') { const v = argv[++i]; args.height = v === 'auto' ? 'auto' : Number(v); }
    else if (a === '--json') args.json = true;
    else if (a.startsWith('--')) fail(`Unknown flag: ${a}`);
    else positional.push(a);
  }
  args.input = positional[0];
  return args;
}

function fail(msg) {
  console.error(`check.mjs: ${msg}`);
  console.error('Usage: node scripts/check.mjs input.html [--preset square|story|wide|og|a4|tall] [--width N] [--height N|auto] [--json]');
  process.exit(2);
}

const args = parseArgs(process.argv.slice(2));
if (!args.input) fail('need an input .html');

let { width, height } = args.preset
  ? PRESETS[args.preset] ?? fail(`unknown preset "${args.preset}" (have: ${Object.keys(PRESETS).join(', ')})`)
  : {};
if (args.width) width = args.width;
if (args.height !== undefined) height = args.height;
width ??= 1080;
height ??= 1080;

const browser = await chromium.launch();
let report;
try {
  const page = await browser.newPage({
    viewport: { width, height: height === 'auto' ? 1080 : height },
  });
  await page.goto(pathToFileURL(resolve(args.input)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150); // settle layout after font swap

  report = await page.evaluate(({ width, height, FONT_MIN, FONT_COMFORT }) => {
    const boundsH = height === 'auto' ? document.documentElement.scrollHeight : height;
    const errors = [];
    const warnings = [];
    let waived = 0;

    const visible = (el) => {
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (parseFloat(cs.opacity) < 0.05) return false;
      }
      return true;
    };

    const describe = (el) => {
      let sel = el.tagName.toLowerCase();
      if (el.id) sel += `#${el.id}`;
      else if (el.classList.length) sel += '.' + [...el.classList].slice(0, 2).join('.');
      const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);
      return text ? `<${sel}> “${text}${text.length === 28 ? '…' : ''}”` : `<${sel}>`;
    };
    const at = (r) => `at ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)}`;

    // ---- collect text leaves with glyph-tight rects -------------------------
    // Range rects hug the actual glyphs, so a full-width <p> box next to a
    // floated figure doesn't false-positive the collision check.
    const byElement = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim()) continue;
      const el = node.parentElement;
      if (!el || !visible(el)) continue;
      (byElement.get(el) ?? byElement.set(el, []).get(el)).push(node);
    }

    // Line boxes and char cells include ascent/descent air far beyond the
    // glyph ink, especially on display type. The canvas TextMetrics API
    // measures the actual ink bounds for a string in a given font, so the
    // rects below hug what is really painted.
    const mctx = document.createElement('canvas').getContext('2d');
    const metricsFor = (el, text) => {
      const cs = getComputedStyle(el);
      mctx.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize)}px ${cs.fontFamily}`;
      const m = mctx.measureText(text);
      return {
        fontAsc: m.fontBoundingBoxAscent ?? 0,
        fontDesc: m.fontBoundingBoxDescent ?? 0,
        inkAsc: m.actualBoundingBoxAscent ?? 0,
        inkDesc: m.actualBoundingBoxDescent ?? 0,
        advance: m.width,
      };
    };
    const bboxOf = (pts) => {
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      const left = Math.min(...xs), right = Math.max(...xs);
      const top = Math.min(...ys), bottom = Math.max(...ys);
      return { left, right, top, bottom, width: right - left, height: bottom - top };
    };

    const leaves = [];
    for (const [el, nodes] of byElement) {
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      let rects = [];

      if (el instanceof SVGElement) {
        // Per-character ink boxes, honoring each char's rotation, so labels
        // on a curved path don't inherit the whole arc's bounding box.
        try {
          const ctm = el.getScreenCTM();
          const n = el.getNumberOfChars();
          const chars = el.textContent;
          if (ctm && n) {
            for (let i = 0; i < n; i++) {
              const ch = chars[i];
              if (!ch || !ch.trim()) continue;
              const ext = el.getExtentOfChar(i);
              const m = metricsFor(el, ch);
              const rot = (el.getRotationOfChar(i) * Math.PI) / 180;
              // Rebuild the ink box in char-local coords (origin: cell
              // center), rotate it, then map through the screen CTM.
              const cx = ext.x + ext.width / 2;
              const cy = ext.y + ext.height / 2;
              const baseOff = (m.fontAsc - m.fontDesc) / 2; // baseline below cell center
              const w2 = m.advance / 2;
              const cos = Math.cos(rot), sin = Math.sin(rot);
              const pts = [
                [-w2, baseOff - m.inkAsc], [w2, baseOff - m.inkAsc],
                [-w2, baseOff + m.inkDesc], [w2, baseOff + m.inkDesc],
              ].map(([x, y]) => {
                const rx = cx + x * cos - y * sin;
                const ry = cy + x * sin + y * cos;
                return { x: ctm.a * rx + ctm.c * ry + ctm.e, y: ctm.b * rx + ctm.d * ry + ctm.f };
              });
              rects.push(bboxOf(pts));
            }
          }
        } catch { /* not an SVGTextContentElement */ }
        if (!rects.length) rects = [el.getBoundingClientRect()];
      } else {
        // Range rects hug the line boxes; shave each down to the measured
        // ink ascent/descent. Which sides carry the metric air depends on
        // the text's orientation (rotated headers, vertical writing modes).
        let angle = 0;
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          const t = getComputedStyle(n).transform;
          if (t && t !== 'none') {
            const m = new DOMMatrix(t);
            angle += Math.atan2(m.b, m.a) * 180 / Math.PI;
          }
        }
        if (getComputedStyle(el).writingMode.startsWith('vertical')) angle += 90;
        const norm = ((Math.round(angle) % 360) + 360) % 360;
        const upright = norm % 180 < 3 || norm % 180 > 177;
        const sideways = Math.abs((norm % 180) - 90) < 3;

        const text = nodes.map((n) => n.textContent).join(' ').trim();
        const m = metricsFor(el, text);
        const airTop = Math.max(0, m.fontAsc - m.inkAsc);
        const airBottom = Math.max(0, m.fontDesc - m.inkDesc);
        let iL = 0, iR = 0, iT = 0, iB = 0;
        if (upright) { iT = airTop; iB = airBottom; }
        else if (sideways) { iL = iR = (airTop + airBottom) / 2; }
        else { iL = iR = iT = iB = (airTop + airBottom) / 2; } // arbitrary rotation: AABB is loose anyway

        for (const node of nodes) {
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const r of range.getClientRects()) {
            const left = r.left + Math.min(iL, r.width / 3);
            const right = r.right - Math.min(iR, r.width / 3);
            const top = r.top + Math.min(iT, r.height / 3);
            const bottom = r.bottom - Math.min(iB, r.height / 3);
            rects.push({ left, right, top, bottom, width: right - left, height: bottom - top });
          }
        }
      }

      rects = rects.filter((r) => r.width > 0.5 && r.height > 0.5);
      if (!rects.length) continue;
      const inkArea = rects.reduce((s, r) => s + r.width * r.height, 0);
      leaves.push({ el, rects, fontSize, inkArea });
    }

    // ---- font-size floors ---------------------------------------------------
    for (const { el, fontSize } of leaves) {
      if (fontSize < FONT_MIN) {
        errors.push(`text-too-small  ${describe(el)} is ${fontSize.toFixed(1)}px (floor ${FONT_MIN}px)`);
      } else if (fontSize < FONT_COMFORT) {
        warnings.push(`text-small      ${describe(el)} is ${fontSize.toFixed(1)}px (comfort floor ${FONT_COMFORT}px)`);
      }
    }

    // ---- text vs canvas edges ----------------------------------------------
    const EDGE = 2;
    for (const { el, rects } of leaves) {
      for (const r of rects) {
        if (r.left < -EDGE || r.top < -EDGE || r.right > width + EDGE || r.bottom > boundsH + EDGE) {
          errors.push(`text-offcanvas  ${describe(el)} ${at(r)} leaves the ${width}×${boundsH} canvas`);
          break;
        }
      }
    }

    // ---- text vs overflow-clipping ancestors --------------------------------
    for (const { el, rects } of leaves) {
      if (el instanceof SVGElement) continue; // svg clipping is usually intentional chart framing
      for (let anc = el; anc && anc !== document.body; anc = anc.parentElement) {
        const cs = getComputedStyle(anc);
        const clips = (v) => v === 'hidden' || v === 'clip' || v === 'scroll' || v === 'auto';
        if (!clips(cs.overflowX) && !clips(cs.overflowY)) continue;
        const box = anc.getBoundingClientRect();
        const cut = rects.some((r) =>
          (clips(cs.overflowX) && (r.left < box.left - EDGE || r.right > box.right + EDGE)) ||
          (clips(cs.overflowY) && (r.top < box.top - EDGE || r.bottom > box.bottom + EDGE)));
        if (cut) {
          errors.push(`text-clipped    ${describe(el)} is cut off by overflow-hidden ${describe(anc)}`);
          break;
        }
      }
    }

    // ---- text-on-text collisions -------------------------------------------
    // Sum the ink-rect intersections between the two elements and compare to
    // the smaller element's total ink area, so a one-char graze between long
    // labels reads as a near-miss while a label buried under another element
    // reads as a collision.
    const COLLIDE_RATIO = 0.12; // error: >12% of the smaller element's ink covered
    const NEAR_RATIO = 0.05;    // warning above this
    const seenPairs = new Set();
    for (let i = 0; i < leaves.length; i++) {
      for (let j = i + 1; j < leaves.length; j++) {
        const a = leaves[i];
        const b = leaves[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        let inter = 0;
        let worstArea = 0;
        let where = null;
        for (const ra of a.rects) {
          for (const rb of b.rects) {
            const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
            const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
            if (w < 4 || h < 4) continue;
            inter += w * h;
            if (w * h > worstArea) {
              worstArea = w * h;
              where = { left: Math.max(ra.left, rb.left), top: Math.max(ra.top, rb.top), width: w, height: h };
            }
          }
        }
        if (!inter) continue;
        const ratio = inter / Math.min(a.inkArea, b.inkArea);
        if (ratio < NEAR_RATIO) continue;
        const key = `${describe(a.el)}|${describe(b.el)}`;
        if (seenPairs.has(key)) continue;
        seenPairs.add(key);
        if (a.el.closest('[data-overlap-ok]') || b.el.closest('[data-overlap-ok]')) {
          waived++;
          continue;
        }
        const line = `${describe(a.el)} and ${describe(b.el)} ${at(where)} (${Math.round(ratio * 100)}% of the smaller one's ink covered)`;
        if (ratio >= COLLIDE_RATIO) errors.push(`text-collision  ${line}`);
        else warnings.push(`text-near-miss  ${line}`);
      }
    }

    // ---- page must fit the canvas ------------------------------------------
    if (height !== 'auto') {
      const sw = document.documentElement.scrollWidth;
      const sh = document.documentElement.scrollHeight;
      if (sw > width + EDGE || sh > boundsH + EDGE) {
        errors.push(`canvas-overflow page is ${sw}×${sh}, canvas is ${width}×${boundsH} — content escapes or scrolls`);
      }
    }

    // ---- hero emphasis ------------------------------------------------------
    const heroes = [...document.querySelectorAll('[data-hero]')];
    if (heroes.length === 0) {
      warnings.push('hero-missing    no element carries data-hero — mark the hero so emphasis can be checked');
    } else if (heroes.length > 1) {
      errors.push(`hero-multiple   ${heroes.length} elements carry data-hero — an infographic has exactly one hero`);
    } else {
      const r = heroes[0].getBoundingClientRect();
      const share = (r.width * r.height) / (width * boundsH);
      if (share < 0.1) {
        warnings.push(`hero-weak       ${describe(heroes[0])} covers ${Math.round(share * 100)}% of the canvas — the hero should dominate at a glance`);
      }
    }

    return { errors, warnings, waived, textElements: leaves.length };
  }, { width, height, FONT_MIN, FONT_COMFORT });
} finally {
  await browser.close();
}

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const e of report.errors) console.log(`  ✗ ERROR ${e}`);
  for (const w of report.warnings) console.log(`  ! warn  ${w}`);
  const waivedNote = report.waived ? `, ${report.waived} overlap(s) waived via data-overlap-ok` : '';
  console.log(`check: ${report.errors.length} error(s), ${report.warnings.length} warning(s) — ${report.textElements} text elements checked${waivedNote}`);
  if (report.errors.length === 0 && report.warnings.length === 0) {
    console.log('check: clean — go render');
  }
}
process.exit(report.errors.length ? 1 : 0);
