# Blueprint — the technical drawing

## Mood & when to use

A cyanotype engineering sheet: deep blueprint blue, near-white line
drawings, dimension arrows, stamped title block, monospace annotations.
Reads precise, nerdy, lovingly documented. For "how it works" subjects:
machines, buildings, processes, anatomy-of-X, systems. Don't use it when
the subject has no drawable structure.

**Composition note:** this style IS the **Big Object** or **Specimen
sheet** pattern — a line-drawn subject with dimension-line callouts. The
drawing carries the layout; panels are rare.

## Palette

Structure vs data is the key split:

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#123A66` | blueprint blue |
| `--bg-2` | `#0D3054` | darker zones, title block |
| `--line` | `#D8E8F8` | **drawing ink** — outlines, dimensions, grid, text. Decoration, never data |
| `--line-soft` | `rgb(216 232 248 / 0.45)` | secondary linework, grid |
| `--ink` | `#EAF2FB` | primary text |
| `--ink-muted` | `#9FB8D4` | secondary text |
| `--chart-1` | `#3E9BD6` | process blue |
| `--chart-2` | `#B8860B` | brass |
| `--chart-3` | `#C75B9B` | magenta (2.96:1 — its marks are ALWAYS direct-labeled) |
| `--chart-4` | `#6F9436` | olive |
| `--de-emphasis` | `#2A537F` | context fills |

Chart slots validated for dark mode on `--bg`. The near-white `--line` is
reserved for the DRAWING (the subject, dimensions, annotations); data
marks (bars, fills, segments) use the four validated slots so series stay
CVD-separable.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;700&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

- Display: **Saira Condensed** 700, uppercase, +0.04em — titles, stamps.
- Everything else: **IBM Plex Mono** 400/500/600; italic for asides.
- Scale (1080px canvas): title 56–72px · section 22px Saira 600 ·
  annotation 14px mono · caption 12px mono. Hero number 90–140px Saira 700.
- Dimension labels: 13px mono on the line, in a small `--bg` knockout so
  the line breaks around them.

## Geometry & spacing

- Radii 0. No shadows, no gradients (a faint vignette on `--bg` allowed).
- Linework: subject outlines 2.5px `--line`; detail lines 1.25px; grid
  1px `--line-soft` at 40px cells (whole canvas, under everything).
- **Dimension lines**: 1px with arrowheads (SVG markers) + knockout label;
  leader lines end in a 4px dot at the part they name.
- Double-rule border frame 12px in from the canvas edge (2px + 1px lines).
- Spacing scale: 8 / 16 / 24 / 40 / 56.

## Chart styling

- Bars/columns: 2px `--line` outline, filled with a chart slot at 85%
  opacity or its 45° hatch (see devices); ≤ 24px; square ends; values
  in mono at the end. No extra gridlines (the canvas grid serves).
- Prefer charts that look like engineering: dimensioned bars, section
  cut-fills, calibrated meters. Donuts styled as gauge dials (thin ring +
  tick marks).
- Every mark direct-labeled (mandatory for `--chart-3`).

## Signature devices

1. **The title block**: bottom-right stamped box (double border, `--bg-2`)
   with rows: TITLE / DWG NO / SCALE / DATE / SOURCE — the footer IS the
   device.
2. **Hatch fills**: `repeating-linear-gradient(45°, color 0 1.5px,
   transparent 1.5px 7px)` as the fill for zones and one bar series —
   drafting shading, and a free CVD secondary encoding.
3. **Dimension arrows** with knockout labels measuring real values on the
   drawing — data as annotation.
4. **Registration crosses** (+) at 3 corners, 1px `--line-soft`.
5. **Revision cloud**: a scalloped bubble around ONE highlighted fact,
   with "REV A" tag.

## Do / Don't

- **Do** draw the subject in `--line` linework — no filled illustration.
- **Do** annotate with real values; every callout earns its leader line.
- **Do** keep the grid faint; it's paper texture, not a chart grid.
- **Don't** use white fills or bright panels — line on blue, always.
- **Don't** round corners or soften anything.
- **Don't** let `--line` carry series identity in a chart.
- **Don't** rotate anything except stamp devices (±2° max).

## CSS tokens

```css
:root {
  --bg:#123A66; --bg-2:#0D3054;
  --line:#D8E8F8; --line-soft:rgb(216 232 248 / 0.45);
  --ink:#EAF2FB; --ink-muted:#9FB8D4;
  --chart-1:#3E9BD6; --chart-2:#B8860B; --chart-3:#C75B9B; --chart-4:#6F9436;
  --de-emphasis:#2A537F;
  --font-display:'Saira Condensed',sans-serif; --font-body:'IBM Plex Mono',monospace;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:56px;
  --radius:0;
  --hatch-1:repeating-linear-gradient(45deg, #3E9BD6 0 1.5px, transparent 1.5px 7px);
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:700; text-transform:uppercase;
              letter-spacing:.04em; line-height:.95; }
.grid-bg { background-image:
  linear-gradient(var(--line-soft) 1px, transparent 1px),
  linear-gradient(90deg, var(--line-soft) 1px, transparent 1px);
  background-size:40px 40px; }
.annotation { font:400 14px/1.5 var(--font-body); color:var(--ink-muted); }
```
