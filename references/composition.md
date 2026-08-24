# Composition — layouts that don't look generated

The single biggest tell of a machine-made infographic is **rounded cards in
a symmetric grid on a flat background**. That is a dashboard, not an
infographic. A designed composition has a *dominant object*, *asymmetry*,
*overlap*, and *tension between dense and empty*. This file is how you get
there deliberately.

## Rule zero: the canvas is a PLACE, not a page

Field-tested against real audiences: the pieces people love build a
**scene** — a drafting sheet with registration crosses and a stamped title
block; deep space with aurora light and a beam converging on a star; a
night sky over a magazine page; a cook's sketchbook. The pieces people
call "AI slop" — even flawlessly executed ones — arrange type and shapes
on a plain ground. **Flat graphic minimalism is a slop signal in itself.**

Before choosing a pattern, answer in one phrase: *where is the reader
standing?* ("looking at an engineer's drawing", "floating in the launch
plume", "leafing through a naturalist's field book"). Everything on the
canvas — background, texture, chrome, the way data is drawn — must belong
to that place. If the answer is "looking at a well-designed page", start
over.

Scene-craft that separates loved from slop:

- **Environmental depth**: a background that participates (grid paper,
  starfield, paper grain, horizon) instead of a colored void.
- **Detail density**: many small deliberate artifacts of the world —
  registration marks, particles, doodles, stamps, flight paths, ticks.
  Sparse = machine-made; layered small detail = crafted.
- **A story path**: something that travels — a flyback arc, a bee's
  dashed flight, a beam narrowing — connecting the facts in sequence.
- **Diegetic data**: charts drawn as instruments OF the scene (a dial on
  the sheet, a constellation, a measuring cup), never floating panels.

## The prime rule

**Pick ONE named composition pattern below before writing any HTML**, and
say which one in a comment at the top of the file. "Stack of sections" is
not a composition. The card-grid is permitted only as a *sub-zone* of a
composition (one zone, ≤ ⅓ of the canvas), never as the whole layout.

## The patterns

### 1. The Big Object
One oversized drawn object (see `illustration-and-texture.md`) dominates —
40–70% of the canvas — and the data lives ON and AROUND it: labels pinned
to its parts, a chart built into it (fill level, segments, rings), callouts
with leader lines. The object may bleed off an edge.
*Best for:* single-subject topics (coffee, the brain, a rocket, a house).

### 2. The Bleed
The hero element (giant number, chart, or object) is deliberately cropped
by the canvas edge — the canvas is a window onto something bigger. Pair
with generous empty space on the opposite side. Numbers can run off the
right edge; a donut can be a half-donut against the left edge.
*Best for:* making one big value feel enormous.

### 3. Overlap stack
Elements sit ON each other, not beside: the hero number overlaps the
illustration; a badge overlaps the chart corner; a caption card overlaps
two zones. Use 2–4 overlaps, each meaningful. Overlap requires depth cues:
hard shadows, outlines, or paper-cut edges per the style.
*Best for:* poster energy in square/story formats.

### 4. Diagonal drive
The composition flows on a diagonal: a rotated band carries the title, or
content steps down-right in 3 beats, or the chart baseline itself is the
diagonal. One diagonal, everything else calm — two diagonals is chaos.
*Best for:* momentum subjects (growth, speed, decline).

### 5. Editorial spread
A hard asymmetric split (1/3 : 2/3 or 1/4 : 3/4, never 50:50): one column
is a single towering element (number, vertical text, tall illustration),
the other carries the sections. The thin column is the anchor — biggest
type on the canvas lives there, possibly rotated 90°.
*Best for:* corporate/swiss subjects that must stay sober but not boring.

### 6. The specimen sheet
Many small drawn items in a strict grid, each labeled — like a butterfly
collection or a parts catalog. The rigor IS the design. Needs ≥ 8 items
and a big plain title; one item may break the grid (larger, tilted, or
highlighted).
*Best for:* "the 12 kinds of…", rankings, taxonomies.

## Tension rules (apply to every pattern)

- **One dense zone, one empty zone.** Somewhere the content packs tight;
  somewhere the background breathes for at least ~15% of the canvas.
  Even spacing everywhere reads as wallpaper.
- **Three sizes minimum.** The largest element ≥ 8× the body text; if
  everything is between 16px and 40px the hierarchy is dead.
- **Something crosses a boundary.** At least one element breaks its
  container, the canvas edge, or a section line. Nothing crossing = template.
- **The background is never uniform.** Give it a big tinted shape, a
  texture, a giant ghosted number/letter, or a gradient of the paper tone —
  subtle, but not flat `#FFF`.
- **Rotate at most one system of elements** (a badge family, a marquee
  band). Everything slightly rotated = chaos; nothing rotated = static.
  (Swiss is the exception: rotation 0, tension from scale + the grid.)

## Litmus tests before you render

- Could this layout hold a SaaS dashboard's data without looking odd?
  → It's a dashboard. Recompose.
- Cover the text: is the topic still recognizable from shapes alone?
  → If not, there is no visual identity. Add the object.
- Are all four corners doing the same amount of work? → No focal point.
