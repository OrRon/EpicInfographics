---
name: epic-infographics
description: Create polished, professional infographic images from data, facts, or a topic. Builds a self-contained HTML/CSS+SVG page in one of several fully-specified design languages, renders it to PNG with a bundled script, then reviews and fixes its own output. Use when the user asks for an infographic, a visual summary, a stats poster, a social graphic, a one-pager image, or "turn this data into an image."
license: MIT
---

# Epic Infographics

You are going to produce an infographic **image** (PNG) by writing a single
self-contained HTML file and rendering it with the bundled script. The three
things that separate a great result from a mediocre one:

1. **Varied data representations** — not everything is a bar chart.
2. **Executing one design language exactly** — its tokens are law.
3. **The render–review–fix loop** — you MUST look at your own PNG and fix it
   before delivering. Never deliver a render you haven't looked at.

## Workflow

### 1. Find the story
Before any visuals, write one sentence: *what should the reader remember?*
Decide which number/fact is the **hero** and which are support. An infographic
is an argument, not a data dump. If the user gave no data, research or derive
it first — never invent statistics; if values are illustrative, label them so.

### 2. Find the visual metaphor
Read `references/illustration-and-texture.md`. List 2–3 physical objects
the subject evokes and pick one that can **carry data** (a cup whose fill
level is the value, a ladder whose rungs are the steps). This becomes the
canvas's subject — the reason the graphic could only be about THIS topic.
Type-led styles (swiss) may go abstract instead, but then scale and
composition must do the identity work. The litmus test comes back at
review: cover the text — is the topic still recognizable?

### 3. Pick the canvas
| Preset | Size (px) | Use for |
|---|---|---|
| `square` | 1080×1080 | social feed post |
| `story` | 1080×1920 | stories/reels, phone-first |
| `wide` | 1920×1080 | presentations, YouTube, wallpaper |
| `og` | 1200×630 | link previews, banners |
| `a4` | 1240×1754 | print poster/handout |
| `tall` | 1080×auto | long-form scrolling infographic |

Aspect drives layout before style does: `story`/`tall` = vertical single-column
flow; `wide` = 2–3 column zones; `square` = hero + 2×2 support grid is a safe
default.

### 4. Pick the design language
Read exactly ONE file from `references/design-languages/` and follow it
completely — palette hexes, fonts, geometry, signature devices, do/don'ts.

- User asked for a vibe → match it (technical → `blueprint`, dramatic/tech →
  `dark-glass`, literary → `editorial`, warm/craft → `retro-print`,
  friendly → `hand-drawn`, nature/science/anatomy → `naturalist-plate`,
  systems/places/playful-spatial → `isometric-world`).
- No preference → pick by subject matter, favoring the scene-native styles
  above.
- **High slop-risk styles** — `swiss`, `corporate-clean`, `neo-brutalist` —
  are flat by construction (type + shapes on a plain ground) and have
  repeatedly failed audience tests. Use them ONLY when the user explicitly
  asks for that look, and even then import scene-craft: environment,
  detail density, a story path (composition.md rule zero).
- Every color and font size in your HTML must come from the style file. No
  freelancing.

### 5. Choose data representations
Read `references/data-vocabulary.md` and pick deliberately **varied** forms:
one hero element (big number, hero chart, or hero pictogram) plus 2–4 support
elements of *different* types. Three bar charts in a row is a failure even if
each one is correct. Prefer forms that fuse with the metaphor (liquid fill,
object-as-bar, icon army) over generic charts beside it.

### 6. Compose and build
Read `references/composition.md` and **pick one named composition pattern**
(Big Object, Bleed, Overlap stack, Diagonal drive, Editorial spread,
Specimen sheet) — state it in an HTML comment. A card grid may only be a
sub-zone (≤ ⅓ of the canvas), never the whole layout. Apply the tension
rules: one dense zone + one empty zone, three sizes minimum, something
crossing a boundary, a non-uniform background, canvas-level texture if the
style calls for it. Then start from `templates/skeleton.html`. Rules:

- Single self-contained file: style tokens as CSS custom properties, all
  charts as **inline SVG** (recipes + math in `references/charts.md`),
  Google Fonts via `<link>`, no other external resources, no JS frameworks.
- One hero element; everything else visually subordinate to it.
- A consistent spacing scale (the style file defines it) — no ad-hoc margins.
- Footer strip: data source (if one exists) and/or attribution.

### 7. Render
```bash
node scripts/render.mjs infographic.html infographic.png --preset square
```
First-time setup (once per machine): `npm install && npx playwright install chromium`
(run from the skill directory). The script waits for fonts, so text always renders.

### 8. Review your own PNG — mandatory
Read the PNG file (view the image). Check ruthlessly:

- [ ] Any text overflowing, clipped, colliding, or widowed?
- [ ] Does the hero element dominate at a glance? Squint test: is there ONE focal point?
- [ ] Are chart proportions truthful (bar ratios match value ratios)?
- [ ] Contrast: is every piece of text comfortably readable?
- [ ] Crowding: does anything need more breathing room?
- [ ] Is the bottom edge awkward (half-empty, or content jammed against it)?
- [ ] Does it look like the design language, or like a generic default?

**Anti-slop pass** (any hit = recompose, not patch):

- [ ] The no-text squint: cover the words — can you still tell the topic?
- [ ] Could this layout hold any other dataset unchanged? (= it's a template)
- [ ] Is it rounded cards in a grid on a flat background? (= dashboard)
- [ ] Is it type + shapes on a plain ground — no scene, no environment, no
      story path? Flat graphic minimalism is slop even when disciplined.
      (= build the place; see composition.md rule zero)
- [ ] Any emoji standing in for an icon?
- [ ] Is everything evenly spaced with nothing crossing a boundary?
- [ ] Is every element between 16–40px with no giant anchor?

Fix and re-render. Minimum one loop; repeat until the list is clean. Deliver
the PNG and offer the HTML source.

## Hard rules

- **No invented data.** Use what the user gave, what you researched, or label
  values as illustrative.
- **Truthful geometry.** Bar lengths, arc angles, and areas are computed from
  values, never eyeballed. Area scales with value (a 2× value bubble has 2×
  area, i.e. √2× radius).
- **No dual-axis charts.** Two measures of different scale → two charts or
  index to a common base.
- **Donut/pie only for part-to-whole at a glance, ≤ 5 segments**, never for
  comparing close values.
- **A static image has no tooltips** — every data mark that matters carries a
  direct label or is readable off a labeled axis. But label selectively:
  the endpoint, the extreme, the hero — not a number on every point.
- **Text never wears the data color** — labels use the style's ink/muted
  tokens; identity comes from the colored mark beside them. (Exception: text
  set inside a colored fill picks white or ink by the fill's luminance.)
- **Series colors come from the style's chart-safe slots, in their fixed
  order.** Past 5 series, fold the tail into "Other."
- **Numbers formatted for humans**: 12.4M not 12400000; units always shown;
  large standalone numbers use proportional (not tabular) figures.
- **No text overflow, no ellipsis truncation** — resize, rewrap, or rewrite.
- **Marks are thin, chrome is quiet** (per style file): hairline gridlines if
  any, generous padding, saturated color reserved for data and accents.
- **Never emoji as icons or illustration** — draw the shape in SVG or omit.
- **No framework-default colors** (Tailwind/Bootstrap hexes) — palettes come
  from the style file, which is art-directed and validated.

## Files

| File | When to read it |
|---|---|
| `references/illustration-and-texture.md` | Step 2, always |
| `references/data-vocabulary.md` | Step 5, always |
| `references/composition.md` | Step 6, always |
| `references/charts.md` | Before writing any chart SVG |
| `references/design-languages/*.md` | Step 4 — exactly one |
| `templates/skeleton.html` | Step 6, as your starting file |
| `scripts/render.mjs` | Run it; read only if debugging |
