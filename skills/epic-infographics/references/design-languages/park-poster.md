# Park Poster — the WPA screen-print vista

## Mood & when to use

A 1930s–40s WPA Federal Art Project park poster (and its modern Fifty-Nine
Parks lineage): a deep scenic vista built from flat screen-printed color
planes, hard edges, no outlines, atmospheric layering, a condensed-caps
title band, and a tiny figure that makes the landscape feel vast. Feels
optimistic, civic, adventurous — "come see this place." For places,
journeys, nature, planets, cities-as-landscape, anything with a horizon or
that can be staged as one. If the subject is an **object** rather than a
place, use `retro-print` instead; if it needs current-gen digital energy,
don't use it at all.

**Composition note:** this style IS a scene — the reader stands inside the
landscape looking at the vista. The canvas is built from 4–6 depth planes
(sky → celestial object → far range → mid range → foreground silhouette).
The title band and ranger footer are mandatory world-building.

## Palette

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#F2E4C0` | warm cream — sky base and paper |
| `--surface` | `#F8EFD8` | lighter paper (title band knockouts) |
| `--surface-2` | `#E5D5AC` | quiet fills, unfilled cells |
| `--ink` | `#262E22` | spruce-black — text, foreground silhouettes |
| `--ink-muted` | `#5C6353` | secondary text |
| `--chart-1` | `#BF4F26` | canyon clay — the lead ink |
| `--chart-2` | `#177A5B` | spruce |
| `--chart-3` | `#9E750F` | golden hour |
| `--chart-4` | `#1D6396` | lake blue |
| `--de-emphasis` | `#C8B98F` | context marks |

Slots validated CVD-safe in this fixed order, with one legal WARN:
clay↔spruce sits in the 6–8 protan band, so **every data mark is
direct-labeled and adjacent fills are separated by a 1.5px paper gap**
(the screen-printer's trap line) — both are non-negotiable in this style.

**The tint system is the style's depth engine.** Landscape planes wear the
same four inks mixed toward the paper: far planes at 30–45% strength
(`color-mix(in srgb, var(--chart-4) 40%, var(--bg))`), mid planes at
60–80%, near planes full-strength, and the foreground silhouette in
`--ink`. Distance = paleness. Full-strength color is reserved for data
marks, the hero celestial object, and the nearest plane.

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Jost:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

- Display: **Oswald** 500/600 — the park-name lettering. Always UPPERCASE,
  letter-spaced +0.06–0.14em, often stacked on two lines with the second
  line larger. Hero numbers Oswald 600.
- Body: **Jost** 400/500 (the era's geometric sans); italic for asides.
- Scale (1080px canvas): title 72–110px Oswald caps · subtitle 20px Jost ·
  kicker 15px uppercase +0.2em · body 17px · caption 13px. Hero number
  110–190px.
- Numbers: proportional; elevations and distances carry their units in
  Jost 500 ("21.9 KM").

## Geometry & spacing

- Radii 0. **No box-shadows, no blur** — depth is the tint system.
- Skies may do one of two things: step in 3–5 **flat horizontal bands**
  (tint steps of one ink), or blend two inks in a single smooth vertical
  gradient. Nothing else on the canvas may gradient.
- **The poster frame**: a single flat border, 10–14px of one ink (usually
  `--ink` or the lead ink), tight to the canvas edge, with the title band
  living inside it.
- Spacing scale: 8 / 16 / 24 / 40 / 64.

## Chart styling

- Data lives **in the landscape** first: mountain/butte heights plotted to
  real values (a comparative skyline with elevation labels), a trail or
  river as the timeline with mile-marker labels, sun rays as a radial
  breakdown, a treeline as an icon army, strata in a canyon wall as
  part-to-whole layers.
- Conventional charts (when needed) sit in the title band or a footer
  panel, never floating in the sky: flat ink fills, square ends, 1.5px
  paper gaps between adjacent fills, no gridlines, values in Jost 500 at
  the mark.
- Every mark direct-labeled (see palette WARN). Leader lines 1px ink,
  horizontal-then-diagonal, no arrowheads.

## Signature devices

1. **Layered planes**: each landscape plane is one flat SVG path spanning
   the full width, stacked back-to-front with tint strength increasing
   toward the viewer. Minimum four planes; ridgelines get small deliberate
   notches (trees, spires, craters) so no edge reads as a naked sine wave.
   **Every plane's base extends down BEHIND the nearer plane** — continue
   each slope past the overlap so no shape ends on a visible flat baseline
   with paper beneath it; a mountain whose base shows is floating, not
   standing.
2. **The title band**: a full-width flat band (12–18% of canvas height) at
   the bottom — lead ink or `--ink` — carrying the stacked Oswald title in
   cream, a thin 2px rule above it, and the subtitle line beneath.
3. **The celestial disc**: one sun or moon, a perfect circle in
   full-strength ink with 1–2 concentric tint rings; optionally 12–24 long
   flat triangular rays. It may double as a data element (a radial chart's
   center, an eclipse-style part-to-whole).
4. **The scale figure**: a tiny (24–44px) flat `--ink` silhouette — hiker,
   ranger, astronaut — standing on a foreground ledge looking into the
   vista. Mandatory: it is what makes the vista vast.
5. **Screen-print grain**: the canvas-level grain overlay from
   `illustration-and-texture.md` at 0.2–0.3 opacity, plus ONE plane
   printed 2–3px off-register (a tint copy offset behind it).
6. **The ranger footer**: a thin strip under the title band in 11–13px
   Jost uppercase +0.2em — "RANGER NATURALIST SERVICE"-style — carrying
   the data source and attribution.

## Do / Don't

- **Do** build at least four depth planes; a vista with two planes is a
  banner, not a place.
- **Do** keep every shape hard-edged and flat — color meets color with no
  outline (this is the opposite of `retro-print`'s drawn-object linework).
- **Do** plot real values into the landscape (elevations, distances) and
  label them there.
- **Do** put one tiny figure in the scene, always.
- **Don't** use white — the lightest tone is `--surface`.
- **Don't** outline landscape shapes or add texture inside them beyond the
  canvas grain; detail comes from the silhouette's edge.
- **Don't** float a chart panel over the sky; charts live in the band, the
  footer, or the landscape itself.
- **Don't** use more than the four inks plus their paper tints.

## CSS tokens

```css
:root {
  --bg:#F2E4C0; --surface:#F8EFD8; --surface-2:#E5D5AC;
  --ink:#262E22; --ink-muted:#5C6353;
  --chart-1:#BF4F26; --chart-2:#177A5B; --chart-3:#9E750F; --chart-4:#1D6396;
  --de-emphasis:#C8B98F;
  --font-display:'Oswald',sans-serif; --font-body:'Jost',sans-serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px;
  --radius:0;
  /* tint helpers — far/mid/near plane strengths for any ink */
  --tint-far:40%; --tint-mid:70%;
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:600; line-height:1.02;
              text-transform:uppercase; letter-spacing:.08em; }
.kicker { font:500 15px/1 var(--font-body); text-transform:uppercase; letter-spacing:.2em; }
.caption { font:400 13px/1.4 var(--font-body); color:var(--ink-muted); }
.poster-frame { position:absolute; inset:0; border:12px solid var(--ink); pointer-events:none; }
/* plane tints: color-mix(in srgb, var(--chart-4) var(--tint-far), var(--bg)) */
```
