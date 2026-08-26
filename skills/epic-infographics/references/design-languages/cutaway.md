# Cutaway — the annotated cross-section

## Mood & when to use

A Dorling Kindersley / Stephen Biesty "Incredible Cross-Sections" plate: a
machine, building, vessel, or organism sliced open on bright paper, its
interior drawn in warm watercolor tints with fine ink linework, swarming
with numbered callouts, leader lines, and tiny people who show the scale.
Curious, encyclopedic, generous with detail — the museum wall panel you
read for ten minutes. For how-it-works subjects: vehicles, buildings,
factories, bodies, budgets-as-compartments, any system whose parts live
inside a thing. Don't use it for abstract announcements, brand launches,
or single-stat social posts with no interior to reveal.

**Composition note:** this style IS a scene — the reader stands at the
exhibit. Big Object is mandatory: the sectioned subject fills 55–75% of
the canvas and the cut face is where the data lives. The callout system
and placard are the world-building chrome.

## Palette

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#FAF6EC` | bright plate paper |
| `--surface` | `#F1EADA` | placard panels, lens interiors |
| `--surface-2` | `#E4DBC4` | quiet fills, unfilled cells |
| `--ink` | `#2B2A26` | drawing ink — text, linework, section lines |
| `--ink-muted` | `#6E695D` | secondary text, hatching |
| `--chart-1` | `#B5432F` | brick — machinery, alerts of the drawing |
| `--chart-2` | `#3E6DA6` | steel blue — water, metal, cool systems |
| `--chart-3` | `#B57F1B` | amber — wood, cargo, energy |
| `--chart-4` | `#0E8E76` | teal — organic, coolant, secondary systems |
| `--chart-5` | `#7B5397` | plum — rare fifth series |
| `--de-emphasis` | `#CFC7B2` | context marks |

Slots validated CVD-safe in this fixed order — all six checks pass. The
interior is **hand-tinted**: compartment fills are a slot color at 30–55%
opacity over the paper with 1–1.5px ink linework on top; full-strength
color is reserved for data marks, callout numbers, and small components.
The cut face uses a slightly stronger tint than the exterior of the same
part, so "inside" always reads a step warmer than "outside".

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700;800&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

- Display: **Bitter** 700/800 — the encyclopedia slab. Title case or caps
  with normal tracking; hero numbers Bitter 800.
- Labels/body: **Source Sans 3**. Callouts open with a **bold lead-in**
  ("**Gearbox** — steps 15 rpm up to 1,500") in 600/700, then regular.
- Scale (1080px canvas): title 56–76px · standfirst 19px · callout
  lead-in 15px · callout text 14px · captions 12.5px (never smaller) ·
  hero number 96–150px.
- Numbered callouts: a 22–26px circle in a full-strength slot color, its
  figure in paper white, Source Sans 700.

## Geometry & spacing

- Radii 0 (drawn corners can be soft, UI corners are not). **No
  box-shadows, no blur** — depth is tint steps and hatching.
- Linework: 1–1.5px ink for the drawing, 3px ink for the **section line**
  (the cut edge), 1px for leader lines.
- Wall thickness at every cut is shown as a 6–14px band filled with
  diagonal ink hatching (45°, 1px lines, 4px apart) — the universal
  "you are looking at a slice" signal.
- Spacing scale: 8 / 16 / 24 / 40 / 64.

## Chart styling

- The compartments ARE the chart wherever possible: compartment areas
  drawn proportional to the values they represent (compute the areas —
  truthful geometry applies to rooms too), levels of a building as ranked
  categories, a tank's fill height as a percentage.
- Conventional charts appear inside a **detail lens** (see devices) or on
  the placard, never floating on open paper: thin bars with watercolor
  fills and 1px ink outlines, square ends, values in Source Sans 600, no
  gridlines.
- Flows are drawn as ducts/pipes whose width scales with the value,
  labeled at the mouth.
- Every mark and compartment direct-labeled via the callout system.

## Signature devices

1. **The section cut**: the subject sliced by one clean plane; a 3px ink
   section line traces the cut, wall thickness shows as hatched bands, and
   interior fills run one tint step stronger than the exterior.
2. **The numbered callout system**: circled numbers pinned to parts, 1px
   ink leader lines (one elbow allowed, 4px open-circle terminus at the
   part), captions collected in margin columns or a strip, each with a
   bold lead-in. Numbers run clockwise from the top-left.
3. **The detail lens**: a circle with a 2px ink ring magnifying one area —
   a zoomed drawing or a micro-chart inside — tethered to its source by
   two tangent lines. One or two per plate, never more.
4. **Tiny people**: 24–44px ink-line figures at true scale doing something
   (climbing a ladder, pushing a cart). At least one, always; they are the
   scale bar with a heartbeat.
5. **The exploded part**: one component pulled out of the body along a
   dashed axis, with a double-arrow dimension line giving its real size.
6. **The museum placard**: a ruled `--surface` block (2px ink border)
   holding the title, standfirst, and hero stat — the exhibit label the
   whole plate hangs off.

## Do / Don't

- **Do** draw interior walls, floors, and machinery so compartments read
  as rooms with contents, not colored zones.
- **Do** pack the plate with at least 8 small drawn details — a chain, a
  valve, a stacked crate; density is the style.
- **Do** number every callout and collect captions in tidy margin columns.
- **Do** keep all text horizontal — the drawing tilts, the labels never do.
- **Don't** float a label without a leader line.
- **Don't** use drop shadows or gradients; depth is tints plus hatching.
- **Don't** fill anything with pure white — every fill is a paper tint.
- **Don't** let the callout circles wander off their parts; the number
  sits on or touches the thing it names.

## CSS tokens

```css
:root {
  --bg:#FAF6EC; --surface:#F1EADA; --surface-2:#E4DBC4;
  --ink:#2B2A26; --ink-muted:#6E695D;
  --chart-1:#B5432F; --chart-2:#3E6DA6; --chart-3:#B57F1B;
  --chart-4:#0E8E76; --chart-5:#7B5397;
  --de-emphasis:#CFC7B2;
  --font-display:'Bitter',serif; --font-body:'Source Sans 3',sans-serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px;
  --radius:0;
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:800; line-height:1.05; }
.standfirst { font:400 19px/1.45 var(--font-body); color:var(--ink-muted); }
.lead-in { font-weight:700; }
.callout-num { display:inline-flex; width:24px; height:24px; border-radius:50%;
               align-items:center; justify-content:center;
               font:700 14px/1 var(--font-body); color:var(--bg); }
.placard { background:var(--surface); border:2px solid var(--ink); padding:var(--space-3); }
/* hatch (wall thickness): repeating-linear-gradient(45deg,
   var(--ink) 0 1px, transparent 1px 5px) at 0.5 opacity */
```
