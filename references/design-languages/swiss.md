# Swiss — International Typographic Style

## Mood & when to use

Zurich, 1960: mathematical grid, grotesque type, enormous scale contrast,
one red. Authority through restraint — the design IS the typography and the
grid; decoration is forbidden. Suits serious data, editorial/journalistic
subjects, architecture, policy, anything that should feel definitive.
Don't use it for playful or warm subjects — it reads institutional.

## Palette

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#F4F1EA` | warm paper off-white (or `#FFFFFF` for harder modernism) |
| `--surface` | `#EAE6DC` | quiet fills, unfilled cells |
| `--surface-2` | `#DDD8CB` | meter tracks, de-emphasis fills |
| `--ink` | `#111111` | near-black — text AND a data color |
| `--ink-muted` | `#6E6A60` | secondary text |
| `--accent` | `#DA291C` | THE Swiss red. Scarce = powerful |
| `--chart-1` | `#DA291C` | red — the story series |
| `--chart-2` | `#111111` | ink — the neutral series (distinguished by lightness, always direct-labeled) |
| `--chart-3` | `#1D4ED8` | blue — third series only when unavoidable |
| `--de-emphasis` | `#B9B3A5` | context series, "everything else" |

Red↔blue validated CVD-safe with wide margins; ink is a neutral slot
(near-zero chroma — legible against both by lightness, never adjacency-
ambiguous). **Hard cap: 3 data hues.** More series → fold into "Other" or
use small multiples. Red is rationed: the hero number OR the hero series OR
one rule-line — never all three.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400;62..125,500;62..125,600;62..125,700;62..125,800&display=swap" rel="stylesheet">
```

- One family: **Archivo** (grotesque, variable width). Display = 600–700,
  optionally condensed (`font-stretch: 85%`) for very large titles; body 400/500.
- Scale (1080px canvas): title 84–120px tight (`line-height:.95`,
  `letter-spacing:-0.03em`) · section 28px · body 17px · caption 12px.
  Hero numbers 120–220px, 700 — scale contrast is the style.
- Casing: titles and body sentence case or lowercase; kickers/axis labels
  UPPERCASE 12px +0.1em. Flush left, ragged right, **never centered, never
  justified**.

## Geometry & spacing

- Radii: **0 everywhere.** Squares are square. No shadows, no gradients.
- The grid is visible discipline: design on a 6-column grid (canvas padding
  72px, gutter 24px); every element snaps to it.
- Rules (lines) are structure: 1px `--ink` hairlines and one optional heavy
  6–8px bar (`--ink` or `--accent`) under the title.
- Spacing scale: 8 / 16 / 24 / 48 / 72.

## Chart styling

- Bars: square-ended (rx=0), ≤ 24px, separated by bg gaps. Columns likewise.
- No gridlines. A single 1px `--ink` baseline/axis rule; values direct-
  labeled in 15px Archivo 600.
- Lines 2.5px; end-dots square (6×6 rects) to stay on-language.
- Donuts allowed but square-cut segment gaps; prefer waffles (square cells,
  rx=0, 2px gutters) — more Swiss.
- Axis/labels: UPPERCASE 12px `--ink-muted`.

## Signature devices

1. **Massive number, tiny label**: 180px `--ink` (or red) figure with a
   12px uppercase label directly beneath — the classic Swiss stat.
2. **The heavy rule**: one 6–8px black or red horizontal bar anchoring the
   title block.
3. **Hairline table**: data as a type table with 1px row rules — in this
   style a beautifully set table IS a data visualization.
4. **Red point**: a single red element (dot, bar, number) in an otherwise
   black composition marks the story.
5. **Column-edge alignment**: captions and sources set in the outermost
   column, top-aligned with content, like a museum caption.

## Do / Don't

- **Do** let scale do the talking: biggest thing 10× the smallest.
- **Do** leave one grid column breathing (empty) when composition allows.
- **Do** set everything flush-left on the grid.
- **Don't** use icons, illustrations, emoji, or rounded corners.
- **Don't** use red for anything that isn't the story.
- **Don't** center anything (a full-bleed title block is the lone exception).
- **Don't** exceed 3 data hues or introduce any hue beyond red/ink/blue.

## CSS tokens

```css
:root {
  --bg:#F4F1EA; --surface:#EAE6DC; --surface-2:#DDD8CB;
  --ink:#111111; --ink-muted:#6E6A60;
  --accent:#DA291C;
  --chart-1:#DA291C; --chart-2:#111111; --chart-3:#1D4ED8;
  --de-emphasis:#B9B3A5;
  --font-display:'Archivo',sans-serif; --font-body:'Archivo',sans-serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:48px; --space-5:72px;
  --radius:0;
  --rule-hair:1px solid var(--ink); --rule-heavy:8px solid var(--ink);
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-weight:700; line-height:.95; letter-spacing:-0.03em; }
.kicker,.axis { font:600 12px/1 var(--font-body); text-transform:uppercase;
                letter-spacing:.1em; color:var(--ink-muted); }
```
