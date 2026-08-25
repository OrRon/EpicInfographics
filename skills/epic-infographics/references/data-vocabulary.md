# Data vocabulary — the ways to present data

Pick the form by the question the data answers, not by habit. An infographic
should mix 3–5 *different* forms; repetition of one form is a design failure.

**Choosing checklist:** (1) What must the reader do — compare, count, follow,
locate? (2) How many values? One value → make it big, don't chart it.
(3) Is precision or impression the goal? Pictograms/waffles give impression;
bars/tables give precision.

## How big? (single values, magnitude)

| Form | What it is | Use when | Avoid when |
|---|---|---|---|
| **Big-number callout** | The value at display size + a short label (+ optional delta) | One value IS the story | You have > 4 of them (becomes a wall of shouting) |
| **Stat row** | 2–4 big numbers side by side, equal weight | A handful of headline figures | The figures need comparing precisely (use bars) |
| **Pictogram count** | Repeated icons, e.g. 10 person-shapes, 7 filled | Human/countable subjects; "7 in 10" facts | Values that aren't clean fractions |
| **Progress meter** | A partial fill against a track | A single ratio vs a limit/target | Multiple ratios (use bars) |
| **Proportional shapes** | Circles/squares sized by value | 2–4 values with dramatic differences | Close values (area is hard to compare) — and area must scale with value: radius ∝ √value |

## Compared to what? (categories)

| Form | Use when | Notes |
|---|---|---|
| **Bar (horizontal)** | Comparing categories, esp. long names or many items | The workhorse; sort by value unless order is inherent |
| **Column (vertical)** | ≤ 6 short-named categories | |
| **Versus panel** | Exactly 2 things compared on several attributes | Split layout, mirrored stats; great hero element |
| **Ranked list + data bars** | Top-N lists | Rank number, name, thin bar, value — one row each |
| **Dot / lollipop plot** | Many categories where solid bars feel heavy | |
| **Slope chart** | 2 time points, several categories, "who rose/fell" | Label both ends directly |
| **Dumbbell** | Before → after per item | 2 shades of one hue, connected |

## What share? (part-to-whole)

| Form | Use when | Notes |
|---|---|---|
| **Donut** | One dominant share, ≤ 5 segments | Put the key % in the hole; never for comparing close values |
| **Waffle grid** | A % as 10×10 (or 5×10) squares | More honest than pies; great for "X% of…" |
| **Stacked bar (single)** | Composition of one total | Horizontal, direct-label segments ≥ 10% |
| **Treemap-lite** | 4–8 nested shares | Rectangles only, hand-computed, labels inside |
| **Funnel / pyramid** | Staged reduction (pipeline, conversion) | Widths must be proportional to values |

## Over time?

| Form | Use when | Notes |
|---|---|---|
| **Line** | Continuous trend, 1–3 series | 2px stroke, label line ends directly |
| **Area** | One series, cumulative feel | Fill at ~10–15% opacity |
| **Column series** | Discrete periods (years, quarters), ≤ 12 | |
| **Timeline** | Events, milestones, history | Vertical for `story`/`tall`, horizontal for `wide`, serpentine for many events on `square`/`a4` |
| **Sparkline** | Trend as an accent inside a stat | No axes; end-dot only |
| **Small multiples** | Same measure across 3–8 entities | Tiny repeated charts, shared scale — shared scale is non-negotiable |

## How does it work? (process, structure)

| Form | Use when | Notes |
|---|---|---|
| **Step flow** | Linear process, 3–6 steps | Numbered nodes + connectors; arrows only if direction isn't obvious |
| **Cycle** | Repeating loop | Nodes on a circle, curved connectors |
| **Decision tree** | Branching yes/no logic | Keep to 2–3 levels in an image |
| **Iceberg / layers** | Visible vs hidden, levels, tiers | Strong metaphor, use sparingly |
| **Quadrant / matrix** | 2 dimensions, few items | Label all four quadrant corners |

## Relationships & sets

| Form | Use when | Notes |
|---|---|---|
| **Venn (2–3 sets)** | Overlap IS the story | Label regions with values; don't fake proportional areas |
| **Mini network** | A hub with spokes, simple ecosystems | ≤ ~10 nodes in a static image |

## Anti-patterns (form level)

- A one-bar bar chart or a 2-slice pie → big-number callout or waffle.
- Radar/spider charts → almost always a ranked bar list reads better.
- 3D anything, exploded pies, gauge dials with needles → never.
- The same form repeated for every section → swap at least half for
  different forms from this list.
- A chart when a sentence + big number says it better.
