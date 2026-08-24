# Editorial — the magazine feature opener

## Mood & when to use

A Sunday-magazine data feature: big literary serif, generous paper, one
oxblood accent, charts that look typeset rather than plotted. Serious but
warm — for essays-with-numbers: culture, health, society, history, money.
Don't use it for product launches or anything that needs to feel digital.

**Composition note:** default to **Editorial spread** or **Bleed**. The
identity carrier is typography at extreme scale — a drop cap, a huge
numeral, a pull-quote — plus one restrained illustration if the subject
gives one.

## Palette

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#FAF7F2` | warm paper |
| `--surface` | `#F1ECE2` | panels (rare — prefer rules over boxes) |
| `--surface-2` | `#E3DCCC` | tracks, unfilled cells |
| `--ink` | `#20242C` | near-black |
| `--ink-muted` | `#6B6F76` | secondary |
| `--accent` | `#A32035` | oxblood — THE accent, rationed |
| `--chart-1` | `#A32035` | oxblood |
| `--chart-2` | `#0D7F63` | emerald |
| `--chart-3` | `#B07C1F` | ochre |
| `--chart-4` | `#20242C` | ink as neutral slot (lightness-distinguished, direct-labeled) |
| `--de-emphasis` | `#C6BFB0` | context series |

Chromatic slots validated; oxblood↔emerald sits in the 6–8 CVD band, so
**direct labels are mandatory on every multi-series chart** (they should be
anyway — this is print). 3 chromatic hues max.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,900;1,9..144,400&family=Libre+Franklin:wght@400;500;600&display=swap" rel="stylesheet">
```

- Display: **Fraunces** 900 at large optical sizes — titles, hero numerals,
  drop caps, pull-quotes. Italic 400 for standfirsts.
- Charts/labels/captions: **Libre Franklin** 400/500/600 (never Fraunces in
  a chart).
- Scale (1080px canvas): title 72–96px Fraunces 900 tight · standfirst 24px
  Fraunces italic · section 15px Libre Franklin 600 uppercase +0.1em ·
  body 17px · caption 13px. Hero numeral 160–260px Fraunces 900.
- Hanging punctuation feel: align numerals and quotes optically, flush left.

## Geometry & spacing

- Radii 0. No shadows. Structure comes from **rules**: 1px ink hairlines,
  and one 3px ink rule under the title block.
- Column grid like a magazine: 2–3 text columns of 300–340px; charts span
  1–2 columns.
- Spacing scale: 8 / 16 / 24 / 48 / 72. Canvas padding 72px.

## Chart styling

- Bars ≤ 20px, square ends, gaps separate; single 1px ink baseline; no
  gridlines. Values Libre Franklin 600 15px; every series direct-labeled.
- Lines 2px; end-dots 8px with paper ring. Donuts thin-ring (24px) only.
- Charts sit inside the text column rhythm — never in a card.

## Signature devices

1. **The huge numeral**: hero figure in Fraunces 900 with the label set
   small INSIDE its counter-space or hanging off its baseline; may bleed
   off the canvas edge.
2. **Drop cap**: a 4–5 line Fraunces 900 initial (oxblood) opening the
   standfirst.
3. **Pull-quote with oxblood quote marks** at 3× text size, set between
   1px rules.
4. **Charticle rows**: a hairline-ruled list where each row is
   label · sparkline/bar · value — a typeset table-chart hybrid.
5. **Folio line**: top or bottom strip "SECTION · TITLE · No. 04" in
   letterspaced caps between hairlines.

## Do / Don't

- **Do** let one numeral or word be 10× everything else.
- **Do** set standfirsts in Fraunces italic; keep chart text in Franklin.
- **Do** use oxblood exactly once as decoration (drop cap OR quote OR rule).
- **Don't** use cards, rounded corners, or shadows.
- **Don't** center anything except a full-width pull-quote.
- **Don't** exceed 3 chromatic series hues; don't skip direct labels.
- **Don't** use any illustration style beyond thin-line engraving-feel SVG.

## CSS tokens

```css
:root {
  --bg:#FAF7F2; --surface:#F1ECE2; --surface-2:#E3DCCC;
  --ink:#20242C; --ink-muted:#6B6F76;
  --accent:#A32035;
  --chart-1:#A32035; --chart-2:#0D7F63; --chart-3:#B07C1F; --chart-4:#20242C;
  --de-emphasis:#C6BFB0;
  --font-display:'Fraunces',serif; --font-body:'Libre Franklin',sans-serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:48px; --space-5:72px;
  --radius:0;
  --rule-hair:1px solid var(--ink); --rule-heavy:3px solid var(--ink);
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:900; line-height:.95; letter-spacing:-0.015em; }
.standfirst { font:italic 400 24px/1.45 var(--font-display); }
.kicker { font:600 15px/1 var(--font-body); text-transform:uppercase; letter-spacing:.1em; color:var(--ink-muted); }
```
