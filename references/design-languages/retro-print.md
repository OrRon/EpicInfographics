# Retro Print — mid-century poster, four inks on cream

## Mood & when to use

A 1960s–70s screen-printed poster: limited inks on warm cream, chunky slab
display type, misregistered fills, film grain over everything. Feels
hand-made, optimistic, collectible. Suits food & drink, travel, nature,
music, nostalgia, "field guide" subjects. Don't use it for corporate
reporting or anything that must feel current-gen digital.

## Palette

The conceit is **four inks + espresso + cream** — decoration and data draw
from the same limited inkset (that limitation IS the style):

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#F5E9D4` | warm cream paper |
| `--surface` | `#FBF3E2` | lighter paper (cards are rare — prefer open composition) |
| `--surface-2` | `#E7D6B6` | quiet fills, unfilled cells |
| `--ink` | `#33241A` | espresso — text, outlines |
| `--ink-muted` | `#6E5B49` | secondary text |
| `--chart-1` | `#C8501E` | burnt orange — the lead ink |
| `--chart-2` | `#157F63` | bottle green |
| `--chart-3` | `#AD7A00` | mustard |
| `--chart-4` | `#8E4468` | plum |
| `--de-emphasis` | `#C9B593` | context marks |

Chart slots validated CVD-safe in this fixed order (4 inks max — fold
longer series into "Other"; the ink limit is non-negotiable). Decoration
uses the SAME four inks, plus tints made by dropping opacity over cream.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Karla:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
```

- Display: **Alfa Slab One** (one weight) — titles, hero numbers. Solid,
  rounded slab; all-caps or title case.
- Body: **Karla** 400/500; values and labels 700. Italic Karla for
  captions/asides.
- Scale (1080px canvas): title 64–84px · section 24px (Karla 700
  uppercase +0.06em) · body 17px · caption 13px italic. Hero number
  120–200px Alfa Slab.
- Numbers: proportional, chunky; no monospace anywhere.

## Geometry & spacing

- Radii: 0, or fully round (pills, circles, arches) — nothing in between.
- **No box-shadows.** Depth comes from misregistration and halftone.
- Borders rare: 2px ink when needed. Prefer open composition on the paper
  over boxed panels.
- Spacing scale: 8 / 16 / 24 / 40 / 64.

## Chart styling

- Bars/columns: flat ink fills, square ends, ≤ 26px; a 2px ink baseline;
  no gridlines. Values Karla 700 at bar ends.
- Donuts: allowed, thick ring, segment gaps in cream; better yet a drawn
  vessel with a liquid fill (see illustration reference).
- Every mark direct-labeled (the mustard slot is 2.5:1 on cream — labels
  are mandatory, per its validation note).
- Waffle/icon armies use drawn motifs (beans, drops, leaves), not squares,
  whenever the subject offers one.

## Signature devices

1. **Misregistration**: display type and big shapes print one ink offset
   3–4px behind the espresso layer — `text-shadow: 4px 3px 0 var(--chart-1)`
   on titles/heroes; for SVG shapes, a fill copy translated (4,3) under the
   true outline. One direction, one accent, consistent everywhere.
2. **Film grain over everything**: the canvas-level grain overlay from
   `illustration-and-texture.md`, rect opacity ~0.3–0.45. Mandatory — this
   style does not ship un-grained.
3. **Arc text**: kickers and seals set on a curve via SVG `<textPath>` —
   the instant vintage-poster move.
4. **The seal**: a circular badge — starburst or scalloped edge (SVG
   polygon), arc text around, a drawn motif in the middle. Carries a real
   stat or claim, slightly rotated, overlapping something.
5. **Sunburst rays**: 16–24 long triangles radiating from behind the hero
   object, in a tint (10–18% opacity ink or mustard).
6. **Halftone shadow**: the dot-pattern block as an object's cast shadow
   or a zone fill.

## Do / Don't

- **Do** build the graphic around a drawn object (this style demands the
  Big Object or Specimen sheet composition).
- **Do** keep to the four inks — mixing in any other hue breaks the print
  fiction.
- **Do** let big display type touch or overlap the illustration.
- **Don't** use box-shadows, gradients (except the paper's quiet radial),
  or rounded-card grids.
- **Don't** use white `#FFF` anywhere — lightest tone is `--surface`.
- **Don't** set body copy on an angle; only devices (seals, banners) rotate.
- **Don't** skip the grain or the misregistration — flat = generic.

## CSS tokens

```css
:root {
  --bg:#F5E9D4; --surface:#FBF3E2; --surface-2:#E7D6B6;
  --ink:#33241A; --ink-muted:#6E5B49;
  --chart-1:#C8501E; --chart-2:#157F63; --chart-3:#AD7A00; --chart-4:#8E4468;
  --de-emphasis:#C9B593;
  --font-display:'Alfa Slab One',serif; --font-body:'Karla',sans-serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px;
  --radius:0;
  --misprint:4px 3px 0 var(--chart-1);
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:400; line-height:1; }
.kicker { font:700 15px/1 var(--font-body); text-transform:uppercase; letter-spacing:.06em; }
.caption { font:italic 400 13px/1.4 var(--font-body); color:var(--ink-muted); }
```
