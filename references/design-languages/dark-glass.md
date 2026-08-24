# Dark Glass — luminous data on deep space

## Mood & when to use

A premium dark-mode poster: near-black blue depths, frosted glass panels,
data that glows. Feels like a launch keynote or an observability product's
big-screen mode. For tech, security, space, gaming, night-themed subjects,
anything that wants drama. Don't use it for print or warm human subjects.

**Composition note:** darkness hides edges, so this style lives on
**Overlap stack** or **Big Object** with layered glow depth. The
background is never flat: aurora blobs + a faint dot-grid constellation.

## Palette

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#0B0E17` | page depth |
| `--bg-2` | `#10141F` | chart surface reference (palette validated on this) |
| `--glass` | `rgb(255 255 255 / 0.05)` | panel fill (+ 1px `rgb(255 255 255 / 0.12)` border) |
| `--ink` | `#EDF1FA` | primary text |
| `--ink-muted` | `#8B93A7` | secondary text |
| `--accent` | `#2B8CC4` | electric blue |
| `--chart-1` | `#2B8CC4` | blue |
| `--chart-2` | `#BF7A20` | amber |
| `--chart-3` | `#12A379` | emerald |
| `--chart-4` | `#8B6CF0` | violet |
| `--chart-5` | `#E05590` | pink |
| `--de-emphasis` | `#3A4157` | context marks |

Slots validated for dark mode (L 0.48–0.67 band, CVD-safe, ≥3:1 on
`--bg-2`). **The glow, not the fill, carries the neon feel**: marks use the
validated fills plus `filter: drop-shadow(0 0 12px <color at 55%>)` — never
lighten the fill itself to look brighter.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&family=Albert+Sans:ital,wght@0,400;0,500;0,700;1,400&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
```

- Display: **Sora** 800 — titles, hero numbers (tight, -0.03em).
- Body: **Albert Sans** 400/500/700. Data values: **IBM Plex Mono** 500.
- Scale (1080px canvas): title 60–76px · section 20px · body 16px ·
  caption/mono labels 13px. Hero number 110–170px Sora 800, optionally with
  a gradient fill (accent → violet) via `background-clip:text` — the ONLY
  gradient allowed on text.
- Kickers: 13px mono uppercase +0.2em in `--accent`.

## Geometry & spacing

- Radii: 16px glass panels, 8px small. Panels: `--glass` fill, 1px
  `rgb(255 255 255 / 0.12)` border, `backdrop-filter: blur(14px)` (layer
  aurora blobs behind so the blur has something to eat).
- Spacing scale: 8 / 16 / 24 / 40 / 64.
- Depth order: bg → aurora blobs → dot grid → glass panels → marks → glows.

## Chart styling

- Bars ≤ 22px, 4px rounded ends, fills from slots + their glow; gaps in
  `--bg-2`. Gridlines `rgb(255 255 255 / 0.07)` hairlines.
- Lines 2.5px with glow; end-dots 8px ringed in `--bg-2`.
- Every mark direct-labeled in mono (tooltips don't exist; mono reads
  instrument-like). Axis text 13px `--ink-muted`.
- Donut rings glow; segment gaps in `--bg-2`, 3 units.

## Signature devices

1. **Aurora field**: 2–3 huge radial-gradient blobs (accent, violet,
   emerald at 12–18% opacity, 400–700px) drifting behind panels, plus one
   near the canvas edge, cropped.
2. **Constellation grid**: a faint dot lattice
   (`radial-gradient(rgb(255 255 255 / 0.10) 1px, transparent 1.4px)`,
   28px cell) across the whole background.
3. **Glow emphasis**: the ONE hero mark/number gets a double-glow
   (12px + 40px drop-shadows); everything else single or none.
4. **Scanline panel**: one glass panel carries 1px horizontal lines
   (`repeating-linear-gradient`, 4% white) — instrument texture.
5. **Terminal footer**: source line as `// figures: …` in mono.

## Do / Don't

- **Do** keep large areas of pure depth — darkness is the empty zone.
- **Do** put glows on data and the hero only; ambient light comes from
  aurora blobs.
- **Do** check text on glass: body text sits on panels or depth, never on
  a blob's bright center.
- **Don't** use pure white text (#FFF vibrates on dark) — `--ink` is tinted.
- **Don't** gradient-fill bars or donuts (fills stay flat + glow).
- **Don't** use warm paper devices (grain, misregistration) — wrong world.
- **Don't** exceed two glass layers deep.

## CSS tokens

```css
:root {
  --bg:#0B0E17; --bg-2:#10141F;
  --glass:rgb(255 255 255 / 0.05); --glass-border:1px solid rgb(255 255 255 / 0.12);
  --ink:#EDF1FA; --ink-muted:#8B93A7;
  --accent:#2B8CC4;
  --chart-1:#2B8CC4; --chart-2:#BF7A20; --chart-3:#12A379;
  --chart-4:#8B6CF0; --chart-5:#E05590; --de-emphasis:#3A4157;
  --font-display:'Sora',sans-serif; --font-body:'Albert Sans',sans-serif;
  --font-data:'IBM Plex Mono',monospace;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px;
  --radius:16px; --radius-sm:8px;
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:800; letter-spacing:-0.03em; line-height:1; }
.kicker { font:500 13px/1 var(--font-data); text-transform:uppercase; letter-spacing:.2em; color:var(--accent); }
.panel { background:var(--glass); border:var(--glass-border); border-radius:var(--radius);
         backdrop-filter:blur(14px); padding:28px; }
.value { font-family:var(--font-data); font-weight:500; }
```
