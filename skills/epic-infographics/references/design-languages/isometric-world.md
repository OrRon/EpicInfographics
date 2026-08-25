# Isometric World — the miniature diorama

## Mood & when to use

A tiny model world on a floating slab: isometric buildings, roads, props
and characters-scale scenery, where the data IS the architecture. Playful
but precise — SimCity meets an explainer. For places, processes,
comparisons of "worlds" (home vs office, city vs country), journeys,
infrastructure, anything spatial. Don't use it for somber subjects or
dense many-series statistics.

**Composition note:** pure scene by construction — Big Object (one
diorama) or a story path (a road/rail winding through stations). The
world floats on a slab with empty sky around it; sky = the breathing zone.

## The isometric projection (use exactly this)

True-iso via the classic 2:1 game projection. World point (x, y, z) — x
runs "south-east", y "south-west", z up — maps to screen:

```
X = X0 + (x − y) * 0.866
Y = Y0 + (x + y) * 0.5 − z
```

A box at (x,y,0), footprint w×d, height h, is three polygons (compute the
6 visible corners with the formula; comment the arithmetic):

- **top** (lightest), **right face** (base color), **left face** (dark).
- Consistent light: sun from the upper-right, always.

Ground tiles, roads, and slabs are flat diamonds (z=0 tops). NEVER mix
projections; nothing is drawn front-on except signs/labels, which may
"billboard" upright.

## Palette

Each data slot is a **face triad** (top / side / dark) so boxes shade
consistently; the side value is the validated chart color:

| Slot | Top | Side (= chart color) | Dark |
|---|---|---|---|
| `--chart-1` coral | `#E58272` | `#D9503F` | `#A93A2D` |
| `--chart-2` teal | `#4DB49D` | `#009B7D` | `#007259` |
| `--chart-3` indigo | `#7A82D8` | `#4A55C8` | `#363F9B` |
| `--chart-4` amber | `#CC9440` | `#B57300` | `#8A5700` |

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#E8EDEF` | sky — cool paper, with a huge soft radial glow behind the slab |
| `--ground` / `--ground-2` | `#CFD8DB` / `#B8C2C6` | slab top / slab sides |
| `--ink` | `#22333B` | text, outlines (1.5–2px on props) |
| `--ink-muted` | `#5D6E75` | secondary text |
| `--de-emphasis` | `#AEB9BD` | context structures |

Side colors validated CVD-safe in slot order (teal is 2.97:1 on the sky —
its marks are always direct-labeled). Props (trees, clouds, tiny
furniture) reuse the same triads plus grays; nothing outside this set.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,800;1,6..12,400&display=swap" rel="stylesheet">
```

- Display: **Fredoka** 600/700 — titles, hero numbers (rounded, toy-like
  without being childish).
- Body/labels: **Nunito Sans** 400/600/800.
- Scale (1080px canvas): title 56–72px · section 20px 800 uppercase
  +0.06em · body 16px · caption 13px. Hero number 100–150px Fredoka 700.
- Value labels live on **signposts or flags** planted in the scene, or on
  billboarded tags with a 2px ink stem to their subject.

## Geometry & spacing

- The **slab**: every diorama sits on a 20–28px-thick ground slab
  (diamond top, two visible sides) with a soft flat ellipse shadow
  beneath — the world floats.
- Prop outlines 1.5–2px ink; buildings may go outline-free (the face
  triads carry the form). Radii 0 in the world; billboarded tags may use
  6px.
- Detail density is the style: scatter 6–12 small props (trees, ducts,
  cones, plants, mugs) — but props never outnumber data elements 2:1.

## Chart styling — data as architecture

- **Bar chart = buildings**: equal footprints, height ∝ value (state the
  px-per-unit factor in a comment); windows as a repeating face pattern;
  value on a rooftop flag or floating tag.
- **Share/segments = districts**: the slab split into colored zones with
  truly proportional diamond areas, or a road dividing territories.
- **Timeline = the road**: a winding path across the slab with stations;
  distance along the path ∝ time when intervals matter (say so if not).
- **Meters = tanks/silos**: cylinders with a visible fill level.
- Every value direct-labeled (billboard tags); no floating panels, no
  gridlines — the world carries everything.

## Signature devices

1. **The floating slab** with soft shadow and one chipped/stepped corner
   (worlds are hand-made, not perfect rectangles).
2. **Signpost values**: a post + arrow-board with the number, planted
   next to what it measures.
3. **The connecting road/path**: dashed centerline, small vehicles or a
   walking figure implying motion through the data.
4. **Sky props**: 2–3 flat isometric clouds and one tiny hot-air balloon
   or bird — sparingly, in the empty zone.
5. **Cutaway wedge**: one building sliced open to show its interior —
   the diorama's "look inside" move for a key detail.

## Do / Don't

- **Do** compute every iso coordinate from the formula — eyeballed
  parallelograms shear visibly.
- **Do** keep one sun: tops lightest, left faces darkest, everywhere.
- **Do** let the scene tell the comparison (bigger building = bigger
  value, longer road = more time).
- **Don't** mix flat charts into the world — if a bar chart is needed,
  build it as buildings.
- **Don't** use gradients on faces (flat triads only), or blur shadows
  (flat ellipses only).
- **Don't** crowd the sky — the empty zone is what makes it a diorama.
- **Don't** exceed 4 data colors; props reuse the same triads.

## CSS tokens

```css
:root {
  --bg:#E8EDEF; --ground:#CFD8DB; --ground-2:#B8C2C6;
  --ink:#22333B; --ink-muted:#5D6E75;
  --chart-1:#D9503F; --chart-1-top:#E58272; --chart-1-dark:#A93A2D;
  --chart-2:#009B7D; --chart-2-top:#4DB49D; --chart-2-dark:#007259;
  --chart-3:#4A55C8; --chart-3-top:#7A82D8; --chart-3-dark:#363F9B;
  --chart-4:#B57300; --chart-4-top:#CC9440; --chart-4-dark:#8A5700;
  --de-emphasis:#AEB9BD;
  --font-display:'Fredoka',sans-serif; --font-body:'Nunito Sans',sans-serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px;
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:700; line-height:1; }
.kicker { font:800 14px/1 var(--font-body); text-transform:uppercase;
          letter-spacing:.06em; color:var(--ink-muted); }
.tag { display:inline-block; background:#FFFFFF; border:2px solid var(--ink);
       border-radius:6px; padding:4px 10px; font-weight:800; }
```
