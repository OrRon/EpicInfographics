# Illustration & texture — giving the graphic a subject

An infographic without a drawn subject is a themed dashboard. This file
covers finding the visual metaphor, drawing it in pure SVG, making data
live inside it, and the finish (grain, halftone, print artifacts) that
separates "rendered" from "made".

**Never use emoji as icons or illustration.** Emoji are the loudest
machine-made tell there is. Draw the shape, or leave it out.

## Finding the metaphor

Before layout, list 2–3 physical objects the subject evokes (coffee → cup,
bean, steam; savings → jar, stack, piggy bank; attention → hourglass,
spotlight, phone). Pick the one that can CARRY DATA, in this order of
preference:

1. **The object is the chart.** Its fill level, segments, or repetitions
   encode a real value: a cup filled to 63%, a battery at 20%, a ladder
   with 5 labeled rungs, a jar of 100 beans where 33 are dark.
2. **The object is annotated.** Real values pinned to its parts with
   leader lines (label the parts of the thing).
3. **The object anchors the composition** (Big Object pattern) with
   charts around it.

Decoration-only illustration is the last resort — if it carries no data
and no structure, keep it small.

## Drawing method: geometric build

Flat, confident spot illustrations come from stacking simple primitives —
circles, rects, arcs, and a few bezier paths. Aim for 8–25 shapes; fewer
reads crude, more reads fussy.

- Build front-facing or in straight profile; avoid 3/4 perspective (hard
  to get right, always looks off).
- Use the style's palette only; big shapes in quiet colors, one accent.
- Outlines are a style decision: brutalist = thick ink outlines;
  retro-print = no outline but misregistered fills; corporate = no
  outline, flat tints; swiss = geometry only, no illustration beyond
  abstract shapes.
- Cast a ground: a flat ellipse shadow or a horizontal rule stops objects
  floating.
- Details that sell a drawing: a highlight sliver on curved surfaces
  (a lighter arc), steam/motion lines, stitching dashes — one or two,
  not all.

Example skeleton (a mug, ~10 shapes):

```html
<svg viewBox="0 0 200 200">
  <ellipse cx="100" cy="182" rx="70" ry="8" fill="rgb(0 0 0 / .12)"/>   <!-- ground -->
  <path d="M40 60 h110 v70 a30 30 0 0 1 -30 30 h-50 a30 30 0 0 1 -30 -30 z" fill="var(--obj)"/>
  <path d="M150 75 h14 a22 22 0 0 1 0 44 h-14 v-14 h12 a8 8 0 0 0 0 -16 h-12 z" fill="var(--obj)"/>
  <ellipse cx="95" cy="60" rx="55" ry="10" fill="var(--obj-dark)"/>      <!-- opening -->
  <ellipse cx="95" cy="60" rx="46" ry="7"  fill="var(--liquid)"/>        <!-- coffee -->
  <path d="M75 38 q6 -10 0 -20 M95 40 q6 -10 0 -20" stroke="var(--ink)"
        stroke-width="3" fill="none" stroke-linecap="round"/>            <!-- steam -->
</svg>
```

## Data-bearing illustration recipes

- **Liquid fill**: draw the vessel, then clip a fill rect to the vessel
  path with `<clipPath>`; rect height = value fraction of the vessel's
  interior height. Add a 2–3px wavy top edge (one quadratic curve). Label
  with the real % beside the surface line.
- **Object-as-bar**: bars built from the subject — stacked books, pencil
  bars, building columns. Each bar is the SAME object stretched only along
  its length axis (never scale a drawing non-uniformly; tile or stretch
  the shaft segment only).
- **Icon army**: `<defs>` + `<use>` grid of a drawn icon (not emoji);
  filled vs outline = the ratio. Clip the last icon for fractions.
- **Segmented object**: a drawn object split into labeled zones (the
  fish's cuts, the house's floors) — a treemap wearing a costume.
- **Path as timeline**: a drawn road/river/cable snakes through the
  canvas; events sit at bends. The path IS the serpentine spine.

## Texture & finish

Subtle physical noise removes the "vector default" feel. All of these are
self-contained (no images):

### Film grain (the workhorse)

```html
<div class="grain"></div>
.grain { position:absolute; inset:0; pointer-events:none; z-index:50;
  opacity:.55; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0.6 0.6 0 0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E"); }
```

Tune with the rect's `opacity` (0.2 = whisper, 0.5 = obvious print).
Grain goes over EVERYTHING (canvas-level overlay), or it looks pasted.

### Halftone dots

```css
.halftone { background-image: radial-gradient(var(--ink) 1.1px, transparent 1.3px);
            background-size: 7px 7px; opacity:.25; }
```

Use as a panel fill, a shadow zone under an object, or inside a big
display letter (via `background-clip:text`). Angle it with a wrapper
`transform: rotate(8deg)` on an oversized block for authentic screen-print
feel.

### Misregistration (retro print)

The fill sits slightly off from its outline, like a 1968 poster printed in
two passes: draw the shape twice — a flat fill translated `3px 2px`, then
the ink outline (or dark copy) at true position. For text:
`text-shadow: 3px 2px 0 var(--accent-2);` on display type, one accent, one
direction, everywhere the same.

### Rough edge (hand-cut look)

```html
<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.04"
  numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n"
  scale="5"/></filter>
```

Apply to big SVG shapes and thick strokes (scale 3–7). Never on text or
thin lines (they shred).

### Paper tone

The background is a tone, not white: warm cream, cool gray-blue — and give
it life with a huge, very quiet radial gradient (`center 8% lighter than
edges`) or one giant tinted shape behind the composition.

## Dos & don'ts

- Do commit: texture everywhere or nowhere — one grainy card on a clean
  canvas looks like a bug.
- Do keep illustration palettes to 3–4 colors + ink.
- Don't gradient-fill illustrated shapes (flat tints; the style's shadow
  device carries depth).
- Don't mix outline weights within one drawing.
- Don't use drop-shadow blur on retro/brutalist work — hard offsets only.
- Don't let texture reduce text contrast below comfortable reading.
