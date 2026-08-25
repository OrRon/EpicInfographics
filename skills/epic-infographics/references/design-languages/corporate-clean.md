# Corporate Clean — the modern report look, warmed up

## Mood & when to use

Crisp and trustworthy, but with paper warmth and typographic character —
an annual report from a design-led company, not a dashboard screenshot.
The default for business data, product metrics, surveys, decks. Don't use
it when the user asked for personality — it is deliberately restrained.

**Composition note:** this style's danger is the card-grid-dashboard look.
Default to the **Editorial spread** pattern (hard asymmetric split with one
towering element); cards only as a sub-zone. The background carries a
ghost element (see devices) so it is never flat white.

## Palette

Art-directed, not framework defaults:

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#FBFAF7` | warm paper-white |
| `--surface` | `#F2EFE8` | cards, section panels |
| `--surface-2` | `#E4E0D5` | unfilled waffle cells, meter tracks |
| `--ink` | `#1B2420` | deep green-black |
| `--ink-muted` | `#5D6660` | secondary text, axis labels |
| `--accent` | `#2D5DE9` | THE cobalt — emphasis, hero numbers, key devices |
| `--chart-1` | `#2D5DE9` | cobalt |
| `--chart-2` | `#0A6B45` | forest |
| `--chart-3` | `#CC6E0F` | ochre |
| `--chart-4` | `#6D4BD0` | iris |
| `--chart-5` | `#C43E7F` | magenta |
| `--de-emphasis` | `#C9CCC2` | "all the other bars" |

Chart slots validated (CVD-safe adjacent pairs, ≥3:1 on the paper) in this
fixed order — never reorder or skip. Single-series charts use `--chart-1`
only. Emphasis form: story series in `--accent`, rest in `--de-emphasis`.
Decoration stays in cobalt + inks; other chart hues appear ONLY as data.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

- Display: **Bricolage Grotesque** 700/800 — titles, hero numbers. It has
  quirk at display sizes without losing the businesslike register.
- Body/labels: **Instrument Sans** 400/500; values and emphasis 600;
  italic for asides.
- Scale (1080px canvas): 64px title · 40px section numbers · 22px
  standfirst · 17px body · 13px caption/axis. Hero number 90–140px.
- Sentence case everywhere; kicker 13px 600 uppercase +0.08em in `--accent`.
- Proportional figures at display sizes; `tabular-nums` only in columns.

## Geometry & spacing

- Radii: 12px cards, 6px small, 4px bar-ends.
- Borders: none, or 1px `--surface-2` hairline. Shadow at most
  `0 1px 3px rgb(27 36 32 / 0.06)`.
- Spacing scale: 8 / 16 / 24 / 40 / 64. Canvas padding 64px.
- Grid discipline, flush left — but the composition split is asymmetric
  (1/3 : 2/3), never a symmetric card wall.

## Chart styling

- Bars/columns ≤ 24px, 4px rounded data-end; gaps separate (no strokes).
  Gridlines 1px solid `#ECE8DE`, few, or none with direct labels.
- Donut ring 30–34px; lines 2.5px with ringed end-dots.
- Value labels 17px Instrument Sans 600 `--ink`; axis 13px `--ink-muted`.

## Signature devices

1. **Ghost anchor**: one enormous background element at 4–6% ink opacity —
   the hero number repeated at 700px, a giant chart motif, or the year —
   cropped by the canvas edge. This is what keeps the background alive.
2. **Kicker + title block** with a 4px × 56px cobalt underline bar.
3. **The tower**: the thin column of the editorial split holds one huge
   rotated or stacked element (number or vertical label) in display type.
4. **Delta chips**: pills (`#DDEEDC`/`#1C5B31` up, `#F6DFD9`/`#8C2F25`
   down) with a drawn ▲/▼ triangle (SVG, not emoji) + value, 13px.
5. **Hairline dividers** between major sections, full-width, `--surface-2`.

## Do / Don't

- **Do** commit to the asymmetric split; let one column tower.
- **Do** leave real paper space — if it feels empty, it's right.
- **Do** keep every chart hue tied to a labeled series.
- **Don't** build a symmetric card grid — that's the slop shape.
- **Don't** use gradients, glows, or more than one shadow level.
- **Don't** color body text — ink and muted only.
- **Don't** use more than 2 font families, or any emoji.

## CSS tokens

```css
:root {
  --bg:#FBFAF7; --surface:#F2EFE8; --surface-2:#E4E0D5;
  --ink:#1B2420; --ink-muted:#5D6660;
  --accent:#2D5DE9;
  --chart-1:#2D5DE9; --chart-2:#0A6B45; --chart-3:#CC6E0F;
  --chart-4:#6D4BD0; --chart-5:#C43E7F; --de-emphasis:#C9CCC2;
  --good-bg:#DDEEDC; --good-ink:#1C5B31; --bad-bg:#F6DFD9; --bad-ink:#8C2F25;
  --font-display:'Bricolage Grotesque',sans-serif; --font-body:'Instrument Sans',sans-serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px;
  --radius:12px; --radius-sm:6px;
  --hairline:1px solid var(--surface-2);
  --shadow:0 1px 3px rgb(27 36 32 / 0.06);
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,h2,.display { font-family:var(--font-display); font-weight:700; letter-spacing:-0.02em; }
.kicker { font:600 13px/1 var(--font-body); text-transform:uppercase;
          letter-spacing:.08em; color:var(--accent); }
.card { background:var(--surface); border-radius:var(--radius); padding:28px; }
.ghost { position:absolute; font-family:var(--font-display); font-weight:800;
         color:rgb(27 36 32 / 0.05); pointer-events:none; line-height:.8; }
```
