#!/usr/bin/env node
// Preflight layout checker — run BEFORE rendering the PNG.
//
//   node scripts/check.mjs input.html [--preset name] [--width N] [--height N|auto]
//                          [--safe-margin N] [--contrast-strict] [--json]
//
// Loads the page in headless Chromium and verifies the layout mechanically:
//
//   ERRORS (must fix before rendering):
//     text-collision   two text elements paint over each other
//     text-clipped     text cut off by an overflow-hidden ancestor
//     svg-text-clipped text cut off by its <svg> viewport (or a clipping svg ancestor)
//     text-offcanvas   text extends past the canvas edge
//     text-too-small   computed font size below the readable floor
//     text-contrast    text badly fails contrast against its rendered background
//                      (ratio < 2/3 of its WCAG requirement; with
//                      --contrast-strict every WCAG AA miss is an error).
//                      The 2/3-band-error / AA-miss-warning tiering is the
//                      RATIFIED, permanent contract: most design languages set
//                      muted ink near 4:1 by design, so strict AA-as-error
//                      would block the entire shipped gallery.
//     shape-crosses-text  a stroked SVG shape or an element border passes
//                      through a text element's glyph ink (leader lines,
//                      paths, rules crossing labels)
//     hero-multiple    more than one element marked data-hero
//     canvas-overflow  page content is larger than the canvas
//
//   WARNINGS (fix, or justify in one line at review):
//     hero-missing     no element marked data-hero (emphasis checks skipped)
//     hero-weak        the data-hero element occupies <10% of the canvas
//     text-small       font size readable but tight (below comfort floor)
//     text-near-miss   two text elements almost touching
//     svg-edge-near    svg text within 3px of its svg viewport edge
//     text-contrast    text misses its WCAG AA target but stays ≥ 2/3 of it
//     shape-near-text  stroke geometry within the 3px clearance of glyph ink
//                      without touching it
//     safe-area        text inside the --safe-margin band at the canvas edge
//                      (only when --safe-margin is passed; for outputs that get
//                      cropped downstream, e.g. zoompan/social crops)
//
// Contrast is measured on the RENDERED artifact: the page is screenshotted
// twice (as-is, and with all text painted transparent), and the mean pixel
// color behind each text element's ink rects is compared to its computed
// color per WCAG 2.x (4.5:1 normal text, 3:1 large text — ≥24px, or
// ≥18.66px at weight ≥700). Gradient-filled text (background-clip:text),
// text with paint-server fills, and unresolvable colors are skipped and
// counted in the report.
//
// The shape check is GEOMETRIC-FIRST by design: stroke centerlines are
// sampled (~4px steps via getPointAtLength), inflated by strokeWidth/2 plus a
// 3px clearance, and tested against glyph ink rects. A pixel-differencing
// fallback is deliberately out of scope — canvas-level grain and halftone
// textures (retro-print, naturalist-plate) would false-positive it. Knockout
// labels (a bg-filled shape breaking the line under the text — a blueprint
// device) are recognized by hit-testing the deepest sample point: if an
// opaque element covers the stroke there, the line is visually interrupted
// and the pair is skipped. Same-element, ancestor/descendant, and
// same-immediate-group pairs (a number on its own callout chip) are exempt.
// Two tempering rules keep the error tier honest: an ERROR requires the
// stroke centerline to actually enter the glyph box (≥1px) — a leader
// grazing its own label's edge is a warning — and a label whose center sits
// INSIDE a closed shape's fill (badge, cell, ring, plate border) is treated
// as contained, one tier down.
//
// Deliberate layering (e.g. a giant translucent numeral behind a headline) is
// waived by putting data-overlap-ok on either element; a deliberate stroke
// through text (a strike-through device) is waived with data-cross-ok on the
// shape or the text. Waivers are counted and reported — use them sparingly
// and only after visually confirming legibility.
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
    else if (a === '--safe-margin') args.safeMargin = Number(argv[++i]);
    else if (a === '--contrast-strict') args.contrastStrict = true;
    else if (a === '--json') args.json = true;
    else if (a.startsWith('--')) fail(`Unknown flag: ${a}`);
    else positional.push(a);
  }
  args.input = positional[0];
  return args;
}

function fail(msg) {
  console.error(`check.mjs: ${msg}`);
  console.error('Usage: node scripts/check.mjs input.html [--preset square|story|wide|og|a4|tall] [--width N] [--height N|auto] [--safe-margin N] [--json]');
  process.exit(2);
}

const args = parseArgs(process.argv.slice(2));
if (!args.input) fail('need an input .html');
const safeMargin = args.safeMargin ?? 0;
if (Number.isNaN(safeMargin) || safeMargin < 0) fail('--safe-margin must be a non-negative number of px');

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
  // Animated files are checked at their END state — mid-build opacity/offsets
  // would hide text from every geometry check below.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      a.pause();
      const t = a.effect?.getComputedTiming();
      if (t && Number.isFinite(t.endTime)) a.currentTime = t.endTime;
    }
  });

  report = await page.evaluate(({ width, height, FONT_MIN, FONT_COMFORT, safeMargin }) => {
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
    const parseColor = (str) => {
      const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(str);
      if (!m) return null;
      let a = m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
      return { r: +m[1], g: +m[2], b: +m[3], a };
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
    const offcanvas = new Set();
    for (const { el, rects } of leaves) {
      for (const r of rects) {
        if (r.left < -EDGE || r.top < -EDGE || r.right > width + EDGE || r.bottom > boundsH + EDGE) {
          errors.push(`text-offcanvas  ${describe(el)} ${at(r)} leaves the ${width}×${boundsH} canvas`);
          offcanvas.add(el);
          break;
        }
      }
    }

    // ---- safe-area band (opt-in via --safe-margin) --------------------------
    // Downstream crops (zoompan max-zoom, platform UI overlays) eat the edge;
    // text living there survives the canvas but not the pipeline.
    if (safeMargin > 0) {
      for (const { el, rects } of leaves) {
        if (offcanvas.has(el)) continue; // already an error
        const r = rects.find((r) =>
          r.left < safeMargin || r.top < safeMargin ||
          r.right > width - safeMargin || r.bottom > boundsH - safeMargin);
        if (r) warnings.push(`safe-area       ${describe(el)} ${at(r)} enters the ${safeMargin}px edge band`);
      }
    }

    // ---- text vs overflow-clipping ancestors (HTML) -------------------------
    for (const { el, rects } of leaves) {
      if (el instanceof SVGElement) continue; // svg leaves get the viewport check below
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

    // ---- svg text vs its clipping svg viewport ------------------------------
    // An <svg> clips by default (overflow: hidden), and a viewBox scales the
    // clip with the element box — glyph extents past the border are simply
    // not painted. Only overflow:visible exempts it.
    const NEAR = 3;
    for (const { el, rects } of leaves) {
      if (!(el instanceof SVGElement)) continue;
      for (let svg = el.ownerSVGElement; svg; svg = svg.ownerSVGElement || (svg.parentElement instanceof SVGElement ? null : null)) {
        const cs = getComputedStyle(svg);
        const clips = cs.overflow !== 'visible';
        const box = svg.getBoundingClientRect();
        if (clips) {
          const cutRect = rects.find((r) =>
            r.left < box.left - EDGE || r.right > box.right + EDGE ||
            r.top < box.top - EDGE || r.bottom > box.bottom + EDGE);
          if (cutRect) {
            errors.push(`svg-text-clipped ${describe(el)} ${at(cutRect)} leaves its <svg> viewport ${at(box)}`);
            break;
          }
          const nearRect = rects.find((r) =>
            r.left < box.left + NEAR || r.right > box.right - NEAR ||
            r.top < box.top + NEAR || r.bottom > box.bottom - NEAR);
          if (nearRect) {
            warnings.push(`svg-edge-near   ${describe(el)} ${at(nearRect)} is within ${NEAR}px of its <svg> viewport edge`);
            break;
          }
        }
        if (!svg.ownerSVGElement) break; // reached the outermost svg
      }
    }

    // ---- stroked shapes & borders vs text ink -------------------------------
    // Geometric-first (see the header): sample stroke centerlines, inflate by
    // half the on-screen stroke width, and measure distance to glyph ink.
    const CLEAR = 3;
    let crossWaived = 0;
    const strokes = [];
    for (const el of document.body.querySelectorAll('line, polyline, polygon, path, rect, circle, ellipse')) {
      if (!(el instanceof SVGGeometryElement)) continue;
      if (el.closest('defs, clipPath, marker, mask, pattern, symbol')) continue;
      if (!visible(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.stroke === 'none') continue;
      const sw = parseFloat(cs.strokeWidth) || 0;
      if (!sw) continue;
      const sc = parseColor(cs.stroke);
      if (sc && sc.a * (parseFloat(cs.strokeOpacity) || 1) < 0.05) continue;
      let total;
      try { total = el.getTotalLength(); } catch { continue; }
      if (!total || !Number.isFinite(total)) continue;
      const ctm = el.getScreenCTM();
      if (!ctm) continue;
      const scale = Math.sqrt(Math.abs(ctm.a * ctm.d - ctm.b * ctm.c)) || 1;
      const step = Math.max(4, total / 1500);
      const pts = [];
      for (let d = 0; d <= total; d += step) {
        const p = el.getPointAtLength(d);
        pts.push({ x: ctm.a * p.x + ctm.c * p.y + ctm.e, y: ctm.b * p.x + ctm.d * p.y + ctm.f });
      }
      if (pts.length) strokes.push({ el, pts, half: (sw * scale) / 2, box: bboxOf(pts) });
    }
    // visible HTML borders become edge segments (per side)
    for (const el of document.body.querySelectorAll('*')) {
      if (el instanceof SVGElement) continue;
      if (!visible(el)) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const sides = [
        ['Top',    (bw) => [{ x0: r.left, y0: r.top + bw / 2, x1: r.right, y1: r.top + bw / 2 }]],
        ['Bottom', (bw) => [{ x0: r.left, y0: r.bottom - bw / 2, x1: r.right, y1: r.bottom - bw / 2 }]],
        ['Left',   (bw) => [{ x0: r.left + bw / 2, y0: r.top, x1: r.left + bw / 2, y1: r.bottom }]],
        ['Right',  (bw) => [{ x0: r.right - bw / 2, y0: r.top, x1: r.right - bw / 2, y1: r.bottom }]],
      ];
      for (const [side, mk] of sides) {
        if (cs[`border${side}Style`] === 'none') continue;
        const bw = parseFloat(cs[`border${side}Width`]) || 0;
        if (!bw) continue;
        const bc = parseColor(cs[`border${side}Color`]);
        if (bc && bc.a < 0.05) continue;
        const pts = [];
        for (const seg of mk(bw)) {
          const len = Math.hypot(seg.x1 - seg.x0, seg.y1 - seg.y0);
          const n = Math.max(2, Math.ceil(len / 6));
          for (let i = 0; i <= n; i++) {
            pts.push({ x: seg.x0 + ((seg.x1 - seg.x0) * i) / n, y: seg.y0 + ((seg.y1 - seg.y0) * i) / n });
          }
        }
        strokes.push({ el, pts, half: bw / 2, box: bboxOf(pts), border: side.toLowerCase() });
      }
    }

    for (const sh of strokes) {
      for (const leaf of leaves) {
        if (sh.el === leaf.el) continue;
        if (sh.el.contains(leaf.el) || leaf.el.contains(sh.el)) continue;
        // a label on its own chip/badge/callout: shape + text share an
        // immediate group that isn't the svg root
        const par = sh.el.parentElement;
        if (par && par !== sh.el.ownerSVGElement && par.contains(leaf.el)) continue;
        const pad = sh.half + CLEAR;
        const lb = { left: Math.min(...leaf.rects.map((r) => r.left)), right: Math.max(...leaf.rects.map((r) => r.right)),
                     top: Math.min(...leaf.rects.map((r) => r.top)), bottom: Math.max(...leaf.rects.map((r) => r.bottom)) };
        if (sh.box.left > lb.right + pad || sh.box.right < lb.left - pad ||
            sh.box.top > lb.bottom + pad || sh.box.bottom < lb.top - pad) continue;
        let worst = Infinity, wp = null, depth = 0;
        for (const p of sh.pts) {
          for (const r of leaf.rects) {
            const dx = Math.max(r.left - p.x, 0, p.x - r.right);
            const dy = Math.max(r.top - p.y, 0, p.y - r.bottom);
            const d = Math.hypot(dx, dy);
            if (d < worst) { worst = d; wp = p; }
            if (d === 0) {
              depth = Math.max(depth, Math.min(p.x - r.left, r.right - p.x, p.y - r.top, r.bottom - p.y));
            }
          }
        }
        if (worst >= pad) continue;
        // A grazing touch at a label's edge (a leader ending at its label) is
        // a warning; an ERROR needs the centerline to actually enter the ink
        // box, or a wide stroke to paint well past its edge.
        let crossing = depth >= 1 || worst < Math.max(0, sh.half - 1);
        // Containment demotion: a label whose center sits INSIDE a closed
        // shape's fill region is in a container (badge, cell, ring, plate),
        // not crossed by it — one tier down.
        let contained = false;
        if (!sh.border && (/^(circle|ellipse|rect|polygon)$/i.test(sh.el.tagName) ||
            (sh.el.tagName.toLowerCase() === 'path' && /[zZ]\s*$/.test(sh.el.getAttribute('d') || '')))) {
          try {
            const inv = sh.el.getScreenCTM().inverse();
            const c = new DOMPoint((lb.left + lb.right) / 2, (lb.top + lb.bottom) / 2).matrixTransform(inv);
            contained = sh.el.isPointInFill(c);
          } catch { /* not testable */ }
        } else if (sh.border) {
          const r = sh.el.getBoundingClientRect();
          const cx = (lb.left + lb.right) / 2, cy = (lb.top + lb.bottom) / 2;
          contained = cx > r.left && cx < r.right && cy > r.top && cy < r.bottom;
        }
        if (contained) {
          if (!crossing) continue;
          crossing = false; // demote to warning, flagged as containment
        }
        if (crossing && !sh.border && wp.x >= 0 && wp.y >= 0 && wp.x < innerWidth && wp.y < innerHeight) {
          // knockout detection: something opaque paints over the stroke here
          const stack = document.elementsFromPoint(wp.x, wp.y);
          const si = stack.indexOf(sh.el);
          let covered = false;
          for (let k = 0; k < si; k++) {
            const c = stack[k];
            if (c === leaf.el || c.contains(leaf.el) || leaf.el.contains(c) || c.contains(sh.el)) continue;
            const ccs = getComputedStyle(c);
            const fc = parseColor(c instanceof SVGElement ? ccs.fill : ccs.backgroundColor);
            if (fc && fc.a >= 0.8) { covered = true; break; }
          }
          if (covered) continue;
        }
        if (sh.el.closest('[data-cross-ok]') || leaf.el.closest('[data-cross-ok]')) { crossWaived++; continue; }
        const what = sh.border ? `border-${sh.border} of ${describe(sh.el)}` : describe(sh.el);
        const line = `${what} and ${describe(leaf.el)} at ${Math.round(wp.x)},${Math.round(wp.y)} (stroke ${Math.round(sh.half * 2 * 10) / 10}px)${contained ? ' — label inside this container outline' : ''}`;
        if (crossing) errors.push(`shape-crosses-text ${line}`);
        else warnings.push(`shape-near-text  ${line}`);
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

    // ---- serialize leaf geometry + text color for the contrast pass ---------
    // The contrast measurement happens on the rendered pixels (outside this
    // evaluate); here we only collect what each leaf claims to paint with.
    const contrastLeaves = [];
    let contrastSkipped = 0;
    for (const { el, rects, fontSize } of leaves) {
      const cs = getComputedStyle(el);
      const isSvg = el instanceof SVGElement;
      // gradient/knockout text paints with something we can't resolve — skip
      const fillStr = isSvg ? cs.fill : (cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color);
      if (!isSvg && (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text')) { contrastSkipped++; continue; }
      if (isSvg && /url\(/.test(fillStr)) { contrastSkipped++; continue; }
      const col = parseColor(fillStr);
      if (!col || col.a < 0.05) { contrastSkipped++; continue; }
      let alpha = col.a;
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        alpha *= parseFloat(getComputedStyle(n).opacity) || 1;
      }
      const weight = parseFloat(cs.fontWeight) || 400;
      contrastLeaves.push({
        desc: describe(el),
        rects: rects.map((r) => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom })),
        fontSize, weight,
        color: { r: col.r, g: col.g, b: col.b },
        alpha,
      });
    }

    return { errors, warnings, waived, crossWaived, textElements: leaves.length, contrastLeaves, contrastSkipped, boundsH };
  }, { width, height, FONT_MIN, FONT_COMFORT, safeMargin });

  // ---- contrast pass: measure the rendered pixels ---------------------------
  // Screenshot the page with every glyph painted transparent, so the sampled
  // pixels are the true background each text element sits on (textures, glass
  // panels, grain overlays and glows included).
  const { contrastLeaves, boundsH } = report;
  if (contrastLeaves.length) {
    await page.addStyleTag({ content: `
      *, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; }
      svg text, svg tspan { fill: transparent !important; stroke: transparent !important; }
    ` });
    const shotH = Math.min(boundsH, 16380);
    const buf = height === 'auto'
      ? await page.screenshot({ fullPage: true })
      : await page.screenshot({ clip: { x: 0, y: 0, width, height: shotH } });
    const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;

    const contrastFindings = await page.evaluate(async ({ dataUrl, leaves }) => {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
      const cv = document.createElement('canvas');
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const sx = img.naturalWidth / cv.width; // screenshots here are 1:1 CSS px

      const lum = (r, g, b) => {
        const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const findings = [];
      for (const leaf of leaves) {
        let R = 0, G = 0, B = 0, n = 0;
        for (const rc of leaf.rects) {
          const x0 = Math.max(0, Math.floor(rc.left)), x1 = Math.min(cv.width, Math.ceil(rc.right));
          const y0 = Math.max(0, Math.floor(rc.top)), y1 = Math.min(cv.height, Math.ceil(rc.bottom));
          if (x1 - x0 < 2 || y1 - y0 < 2) continue;
          const data = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
          const stride = Math.max(1, Math.floor(Math.sqrt(((x1 - x0) * (y1 - y0)) / 400))); // ≤ ~400 samples/rect
          for (let y = 0; y < y1 - y0; y += stride) {
            for (let x = 0; x < x1 - x0; x += stride) {
              const i = (y * (x1 - x0) + x) * 4;
              R += data[i]; G += data[i + 1]; B += data[i + 2]; n++;
            }
          }
        }
        if (!n) continue;
        R /= n; G /= n; B /= n;
        // effective painted color = text color alpha-composited over the bg
        const a = leaf.alpha;
        const tr = leaf.color.r * a + R * (1 - a);
        const tg = leaf.color.g * a + G * (1 - a);
        const tb = leaf.color.b * a + B * (1 - a);
        const L1 = lum(tr, tg, tb), L2 = lum(R, G, B);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const large = leaf.fontSize >= 24 || (leaf.fontSize >= 18.66 && leaf.weight >= 700);
        const needed = large ? 3 : 4.5;
        if (ratio < needed) {
          // Tiering: below ~2/3 of the requirement the text is genuinely hard
          // to read — error. The band between that and the WCAG AA target is a
          // warning (most style files set muted ink near 4:1 by design; a
          // display graphic is not body copy). --contrast-strict promotes
          // every AA miss to an error for accessibility-critical outputs.
          const hard = ratio < needed * (2 / 3);
          findings.push({
            severe: hard,
            line: `text-contrast   ${leaf.desc} is ${ratio.toFixed(1)}:1 against its rendered background (${large ? 'large text, ' : ''}WCAG ${needed}:1${hard ? '' : ' — AA miss'})`,
          });
        }
      }
      return findings;
    }, { dataUrl, leaves: contrastLeaves });

    for (const f of contrastFindings) {
      if (f.severe || args.contrastStrict) report.errors.push(f.line);
      else report.warnings.push(f.line);
    }
  }
  delete report.contrastLeaves;
  delete report.boundsH;
} finally {
  await browser.close();
}

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const e of report.errors) console.log(`  ✗ ERROR ${e}`);
  for (const w of report.warnings) console.log(`  ! warn  ${w}`);
  const waivedNote = (report.waived ? `, ${report.waived} overlap(s) waived via data-overlap-ok` : '')
    + (report.crossWaived ? `, ${report.crossWaived} shape crossing(s) waived via data-cross-ok` : '');
  const skipNote = report.contrastSkipped ? `, ${report.contrastSkipped} skipped by contrast (gradient/paint-server text)` : '';
  console.log(`check: ${report.errors.length} error(s), ${report.warnings.length} warning(s) — ${report.textElements} text elements checked${waivedNote}${skipNote}`);
  if (report.errors.length === 0 && report.warnings.length === 0) {
    console.log('check: clean — go render');
  }
}
process.exit(report.errors.length ? 1 : 0);
