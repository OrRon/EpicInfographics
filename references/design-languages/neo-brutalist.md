# Neo-Brutalist — loud, bordered, unapologetic

## Mood & when to use

Web-native maximalism: thick black borders, hard offset shadows, raw
saturated color on cream, oversized type. Confident, fun, a little punk —
the graphic should look like it could be stickered onto a laptop. Suits
creator/startup content, dev tools, music/culture stats, launch
announcements. Don't use it for somber subjects or conservative audiences.

## Palette

Two classes — **decoration accents** (loud, ALWAYS inside a 3px black
border, never carrying data) and **chart-safe slots** (darker, validated,
the only colors data marks wear):

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#FFF8E7` | warm cream |
| `--surface` | `#FFFFFF` | card fill |
| `--surface-2` | `#F0E7D0` | unfilled cells, meter tracks |
| `--ink` | `#000000` | pure black — text, borders, shadows |
| `--ink-muted` | `#4A4A44` | secondary text |
| `--accent-yellow` | `#FFD500` | decoration: title highlights, badge fills |
| `--accent-pink` | `#FF90E8` | decoration: card fills, shapes |
| `--accent-lime` | `#B5F44A` | decoration: chips, stickers |
| `--chart-1` | `#3B82F6` | blue |
| `--chart-2` | `#FF7A00` | orange (2.5:1 on cream → its marks are ALWAYS bordered + direct-labeled) |
| `--chart-3` | `#009688` | teal |
| `--chart-4` | `#8B5CF6` | violet |
| `--chart-5` | `#E93D82` | pink |
| `--de-emphasis` | `#C9C1AC` | context bars |

Chart slots validated CVD-safe in this fixed order. The border rule doubles
as the separation mechanism: **every filled mark gets a 2–3px `--ink`
border**, so touching fills never rely on color alone.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
```

- Display: **Archivo Black** (one weight, that's the point) — titles, hero
  numbers. Uppercase titles welcome.
- Body: **Space Grotesk** 400/500/700. Data values: **Space Mono** 700.
- Scale (1080px canvas): title 72–96px (`line-height:.95`) · section 30px ·
  body 18px · caption 13px. Hero number 110–170px Archivo Black.
- Slight rotation (−2° to 2°) allowed on badges/stickers — max 2 rotated
  elements per canvas.

## Geometry & spacing

- Borders: **3px solid `--ink` on every container and mark.** Radii: 0–8px
  (pick one value per graphic and stick to it).
- THE shadow: `box-shadow: 6px 6px 0 var(--ink)` on major cards, `4px 4px 0`
  on small elements. Never blurred, never gray.
- Spacing scale: 8 / 16 / 24 / 40 / 56. Canvas padding 56px. Elements may
  sit tight — the borders keep order.

## Chart styling

- Bars/columns: 3px black border, square or 4px-rounded ends, 24–32px
  thick; fills from chart slots. Gaps ≥ 8px.
- No gridlines — a 3px black axis line instead. Values in Space Mono 700,
  15–17px, always shown at the bar end/cap (mandatory for `--chart-2`).
- Donut: bold ring (36–40px) with black border circles inside and out;
  or better, a bordered waffle (cells with 2px borders).
- Line charts: 4px black line; data points as 12px bordered circles filled
  with a chart slot. (Series color rides the points; single series only.)
- Pictograms: bold filled icons with black outlines.

## Signature devices

1. **The sticker/badge**: bordered pill or star, accent fill, hard shadow,
   Space Mono text, rotated ~−2° — for "NEW", a delta, or a callout.
2. **Highlighter title**: key word in the title wrapped in an
   `--accent-yellow` block (padding 0 8px, 3px border).
3. **Hard-shadow stat cards**: white or accent-filled, 3px border,
   6px offset shadow, laid on a slightly-visible grid.
4. **Marquee strip**: a full-width bordered band with repeating uppercase
   text (`TOPIC ★ TOPIC ★ TOPIC`) as header/footer decoration.
5. **Arrow doodles**: thick (4px) black hand-drawn-style SVG arrows
   connecting a callout to its chart.

## Do / Don't

- **Do** border everything; the black line IS the style.
- **Do** use decoration accents generously on shapes — and never on data marks.
- **Do** make one element aggressively oversized.
- **Don't** blur or soften anything (no gradients, no soft shadows, no opacity fades).
- **Don't** rotate more than 2 elements, or by more than ~2.5°.
- **Don't** put yellow/pink/lime fills behind long body text — short labels only.
- **Don't** let charts go border-less "for cleanliness" — that breaks both
  the style and the palette's legibility contract.

## CSS tokens

```css
:root {
  --bg:#FFF8E7; --surface:#FFFFFF; --surface-2:#F0E7D0;
  --ink:#000000; --ink-muted:#4A4A44;
  --accent-yellow:#FFD500; --accent-pink:#FF90E8; --accent-lime:#B5F44A;
  --chart-1:#3B82F6; --chart-2:#FF7A00; --chart-3:#009688;
  --chart-4:#8B5CF6; --chart-5:#E93D82; --de-emphasis:#C9C1AC;
  --font-display:'Archivo Black',sans-serif;
  --font-body:'Space Grotesk',sans-serif;
  --font-data:'Space Mono',monospace;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:56px;
  --radius:6px;
  --border:3px solid var(--ink);
  --shadow:6px 6px 0 var(--ink); --shadow-sm:4px 4px 0 var(--ink);
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); line-height:.95; text-transform:uppercase; }
.value { font-family:var(--font-data); font-weight:700; }
.card { background:var(--surface); border:var(--border);
        border-radius:var(--radius); box-shadow:var(--shadow); padding:24px; }
.badge { display:inline-block; border:var(--border); border-radius:999px;
         padding:6px 14px; font-family:var(--font-data); font-weight:700;
         box-shadow:var(--shadow-sm); }
```
