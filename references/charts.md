# Chart recipes — inline SVG with correct math

Every chart is inline SVG, hand-computed. **Do the arithmetic explicitly**
(in comments if helpful) — eyeballed proportions are the #1 way agent charts
go wrong. All colors reference the style's CSS custom properties
(`var(--chart-1)` etc.), which work inside inline SVG.

## Ground rules (from hard-won dataviz practice, adapted for static images)

- **Truthful geometry**: bar length ∝ value; arc angle ∝ share; area ∝ value
  (so radius ∝ √value). Zero-based scales for bars/columns, always.
- **Thin marks, quiet chrome**: bars ≤ 24–32px thick with air between; lines
  2–3px; gridlines hairline (1px) solid, one step off the background — or
  none at all (an axis line + direct labels often beats a grid in an
  infographic).
- **Static image ⇒ no tooltips exist.** Every value that matters is directly
  labeled or readable off a labeled axis — but label *selectively*: endpoints,
  extremes, the hero series. Not a number glued to every point.
- **Text never wears the series color.** Labels/values use `var(--ink)` /
  `var(--ink-muted)`; the colored mark next to them carries identity. Text set
  *inside* a fill picks white or ink by that fill's luminance.
- **Series colors**: use the style's `--chart-1…5` in fixed order. Adjacent
  fills get a 2–3px gap in the background color (or the style's border
  treatment), never a random outline.
- A label only goes inside a bar/segment if it fits with padding; otherwise
  place it outside the bar end. Never clip text.
- **Round axis ticks** to clean numbers (0 / 50 / 100), and use few of them.

## Layout scaffold

Give the SVG an explicit viewBox and let CSS size it. Define plot geometry
as constants first, then compute every coordinate from them:

```
viewBox: 0 0 W H
padL (room for labels) · padR · padT · padB (room for axis)
plotW = W - padL - padR       plotH = H - padT - padB
scale: x(v) = padL + (v - min) / (max - min) * plotW   (y analogous, inverted)
```

## Horizontal bars

Per category i (rowH ≈ 56–72px: label line + bar + gap):

```
barW_i = value_i / maxValue * plotW          — maxValue may be the data max or a round cap above it
y_i    = padT + i * rowH
```

```html
<g font-family="var(--font-body)" font-size="15">
  <!-- one row: label above, bar + value at tip -->
  <text x="0" y="34" fill="var(--ink)">Category A</text>
  <rect x="0" y="44" width="312" height="20" rx="4" fill="var(--chart-1)"/>
  <text x="322" y="59" fill="var(--ink)" font-weight="600">4.2M</text>
</g>
```

Sort rows by value (unless order is inherent). To emphasize one bar: it gets
`--chart-1` (or the style's emphasis accent), all others get the style's
de-emphasis gray — this "emphasis" form is the honest answer when the story
is one category.

## Columns

```
colW ≈ min(48, plotW / n * 0.6)              — ≤ 60% of the slot; the rest is air
colH_i = value_i / maxValue * plotH
x_i = padL + slotW * i + (slotW - colW) / 2
y_i = padT + plotH - colH_i
<rect x="{x_i}" y="{y_i}" width="{colW}" height="{colH_i}" rx="4"/>
```

`rx` rounds *all* corners; if the style wants a square baseline, overlay the
bottom 4px with a same-color rect, or use a path. Value on the cap
(y_i − 8); category label under the baseline.

## Line & area

Compute each point, then join:

```
x_i = padL + i / (n-1) * plotW
y_i = padT + plotH - (v_i - min) / (max - min) * plotH
<polyline points="x0,y0 x1,y1 …" fill="none" stroke="var(--chart-1)"
          stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
```

Area fill = same points + close along the baseline, fill-opacity ≈ 0.12,
with the stroke drawn on top. End of line gets a dot (r=5, fill = series
color, plus a 2px ring in the background color) and a direct label. Max 3
series; label each at its line end, not in a floating legend, when there's
room. First/last x-labels only, or a handful of year ticks.

## Donut

Use `stroke-dasharray` on circles + `rotate` transforms — no path math needed.
A circle's stroke starts at **3 o'clock and sweeps clockwise** (verified in
Chromium); do NOT position segments with `stroke-dashoffset` (its sign
semantics are a classic trap — a wrong sign makes segments vanish or land on
the wrong arc). Rotate each circle instead:

```
r = 80, C = 2πr ≈ 502.65        stroke-width ≈ 28–36 (thin ring, not a fat pie)
segment_i: dash  = share_i * C - 3        (the -3 shaves a visible gap)
           angle = -90 + Σ(previous shares) * 360    (-90 starts at 12 o'clock)
           transform = rotate(angle 100 100)          (rotate about the center!)
```

```html
<svg viewBox="0 0 200 200">
  <!-- 62%: dash 311.6-3, starts at 12 o'clock -->
  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--chart-1)" stroke-width="32"
          stroke-dasharray="308.6 502.65" transform="rotate(-90 100 100)"/>
  <!-- 38%: starts where the first ends: -90 + 0.62*360 = 133.2 -->
  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--chart-2)" stroke-width="32"
          stroke-dasharray="188.0 502.65" transform="rotate(133.2 100 100)"/>
  <text x="100" y="94" text-anchor="middle" font-size="40" font-weight="700" fill="var(--ink)">62%</text>
  <text x="100" y="118" text-anchor="middle" font-size="14" fill="var(--ink-muted)">label</text>
</svg>
```
Key share + label in the hole. ≤ 5 segments; else waffle or stacked bar.

## Waffle (percentage grid)

10×10 grid of squares (or 5×10 for less height); filled count = round(pct).
Fill order: bottom-left → right, row by row upward (or top-left down — be
consistent). Cell ≈ 18px + 4px gutter, rx per style. Filled cells
`var(--chart-1)`, rest `var(--surface-2)` (a visible-but-quiet step). Big
"62%" beside or above the grid. Generate cells with a loop mentally — write
all 100 rects; don't approximate.

## Pictogram count ("7 in 10")

Define the icon once, stamp it with `<use>`:

```html
<defs><path id="person" d="M12 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 20v-3a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v3z"/></defs>
<use href="#person" x="0"  fill="var(--chart-1)"/>   <!-- filled: the count -->
<use href="#person" x="30" fill="var(--surface-2)"/> <!-- unfilled: remainder -->
```

Partial values: clip the last icon with a `<clipPath>` rect at the right
fraction of its width. Works for any repeatable icon (drop, coin, house).

## Progress meter

Track rect (full width, `var(--surface-2)` or a lighter step of the fill's
own hue) + fill rect at `pct * width`, same height (14–20px), same rx.
Value label at the fill end or right-aligned after the track. Stack several
with shared scale for comparing ratios.

## Slope chart

Two vertical "rails" (x = padL and x = W − padR). For each category, a 2.5px
line from (railL, y(v_before)) to (railR, y(v_after)); dots at both ends.
Direct-label both ends: "Name 34%" left, "56%" right. Emphasize the story
categories with color; others in de-emphasis gray. If labels would collide
(< ~18px apart), nudge the *label* and add a thin leader line — never move
the data point.

## Funnel

Centered stacked trapezoids or bars; **width ∝ value** (not equal steps).
Stage label + value inside if it fits, else to the right. Drop-off
percentages between stages are often the real story — annotate them.

## Timeline

- Vertical (story/tall): a 2–3px spine at fixed x; alternate or single-side
  event cards; node dots (r=6–8, ring in bg color) on the spine. Position ∝
  time only if intervals matter; otherwise equal spacing, and say so via
  labels.
- Horizontal (wide): same rotated; keep ≤ 7 events.
- Serpentine (square/a4): rows alternating direction, connected by
  semicircular arcs at the row ends (`<path d="M … A r r 0 0 1 …"/>`).

## Sparkline

Tiny polyline (~120×36), no axes, no grid; stroke 2px in the de-emphasis
hue with the final point dotted in the accent. Lives inside stat tiles.

## Composition-level rules

- **No dual-axis charts** — two scales on one plot invents correlation.
  Two charts or index both to 100.
- **Small multiples share one scale.** Different scales per panel silently
  lie.
- One chart = one job. If a chart needs a paragraph to explain, split it.
- Check every chart against the style file's chart-styling section — grid
  visibility, mark rounding, and label typography are style decisions.
