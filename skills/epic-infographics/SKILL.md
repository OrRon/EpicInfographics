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
3. **The check–render–review loop** — the mechanical preflight must pass,
   and you MUST look at your own PNG and fix it before delivering. Never
   deliver a render you haven't looked at.

## Workflow

### 1. Understand the brief
An infographic made for "everyone" lands with no one. Before touching any
data, pin down three things:

- **Audience** — who is this for, and how much do they already know?
  (executives skimming, practitioners fluent in the jargon, general public)
- **Goal** — what should the graphic *do*: inform, persuade, impress, or
  drive one action? The goal decides what kind of fact can be the hero.
- **Context** — where will it live (feed, slide deck, print, link preview)?
  This feeds the canvas choice in step 5 and sets how loud the design can be.

If the request already answers these, restate them in one line and move on.
If not, ask the user before proceeding — one round of questions, as
multiple-choice where you have a tool for it (e.g. AskUserQuestion) so
answering takes one click. Only when you are running unattended and cannot
ask, pick sensible answers and state those assumptions at delivery.

### 2. Gather the data
Collect the facts that serve the brief. Use what the user gave; research or
derive the rest — never invent statistics; if values are illustrative, label
them so. Gather slightly more than one graphic needs: the pitch in step 3 is
only honest when there was more than one possible angle in the material.

### 3. Pitch the story
An infographic is an argument, not a data dump. From the data, draft **2–3
candidate story angles**. Each pitch is a working headline, the hero
number/fact that anchors it, and one sentence: *what should the reader
remember?* The angles must genuinely differ — e.g. "how big it is" vs. "how
fast it's changing" vs. "what it costs you" — not rewordings of one claim.

Present the pitches to the user as a multiple-choice question (AskUserQuestion
where available, plain text otherwise), with your recommended angle first and
marked as recommended. If you cannot ask, take your recommendation and say so
at delivery. The chosen angle decides the hero element; every other fact is
support or gets cut.

### 4. Find the visual metaphor
Read `references/illustration-and-texture.md`. List 2–3 physical objects
the subject evokes and pick one that can **carry data** (a cup whose fill
level is the value, a ladder whose rungs are the steps). This becomes the
canvas's subject — the reason the graphic could only be about THIS topic.
Type-led styles (swiss) may go abstract instead, but then scale and
composition must do the identity work. The litmus test comes back at
review: cover the text — is the topic still recognizable?

### 5. Pick the canvas
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

### 6. Pick the design language
Read exactly ONE file from `references/design-languages/` and follow it
completely — palette hexes, fonts, geometry, signature devices, do/don'ts.

- User asked for a vibe → match it (technical → `blueprint`, dramatic/tech →
  `dark-glass`, literary → `editorial`, warm/craft → `retro-print`,
  friendly → `hand-drawn`, nature/science/anatomy → `naturalist-plate`,
  systems/places/playful-spatial → `isometric-world`, places/journeys/
  vistas → `park-poster`, how-it-works/inside-a-machine → `cutaway`).
- No preference → pick by subject matter, favoring the scene-native styles
  above.
- **High slop-risk styles** — `swiss`, `corporate-clean`, `neo-brutalist` —
  are flat by construction (type + shapes on a plain ground) and have
  repeatedly failed audience tests. Use them ONLY when the user explicitly
  asks for that look, and even then import scene-craft: environment,
  detail density, a story path (composition.md rule zero).
- Every color and font size in your HTML must come from the style file. No
  freelancing.

### 7. Choose data representations
Read `references/data-vocabulary.md` and pick deliberately **varied** forms:
one hero element (big number, hero chart, or hero pictogram) plus 2–4 support
elements of *different* types. Three bar charts in a row is a failure even if
each one is correct. Prefer forms that fuse with the metaphor (liquid fill,
object-as-bar, icon army) over generic charts beside it.

### 8. Compose and build
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
- One hero element; everything else visually subordinate to it. Mark it
  with the `data-hero` attribute — the preflight checker uses it to verify
  emphasis.
- A consistent spacing scale (the style file defines it) — no ad-hoc margins.
- Footer strip: data source (if one exists) and/or attribution.

### 9. Preflight the layout — mechanical gate
```bash
node scripts/check.mjs infographic.html --preset square
```
Before rendering a single pixel, the checker loads the page headless and
measures the actual glyph geometry. It reports **errors** (text painted over
other text, text clipped by an overflow ancestor or cut by the canvas edge,
content escaping the canvas, fonts below the readable floor, more than one
`data-hero`) and **warnings** (missing `data-hero`, weak hero dominance,
tight font sizes, near-miss overlaps).

- **Errors block you.** Fix the HTML and re-run until the error count is
  zero. Never render around an error — an error at this stage is a real
  defect, not a formality.
- **Warnings are review items**: fix each one, or keep it only with a
  one-line justification (e.g. a deliberate 10px caption in a print
  titleblock).
- Ink-on-ink layering you designed on purpose (a giant translucent numeral
  behind a headline) is waived with `data-overlap-ok` on one of the two
  elements. Add it only for overlaps that are a composition decision, and
  confirm their legibility in the PNG review — every waiver is yours to
  defend.

### 10. Render
```bash
node scripts/render.mjs infographic.html infographic.png --preset square
```
First-time setup (once per machine): `npm install && npx playwright install chromium`
(run from the skill directory). The script waits for fonts, so text always renders.

### 11. Review your own PNG — mandatory
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

Fix, re-run the preflight (a fix can introduce a new collision), and
re-render. Minimum one loop; repeat until the list is clean. Deliver the PNG
and offer the HTML source.

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
| `references/illustration-and-texture.md` | Step 4, always |
| `references/data-vocabulary.md` | Step 7, always |
| `references/composition.md` | Step 8, always |
| `references/charts.md` | Before writing any chart SVG |
| `references/design-languages/*.md` | Step 6 — exactly one |
| `templates/skeleton.html` | Step 8, as your starting file |
| `scripts/check.mjs` | Step 9 — run it, fix errors, rerun |
| `scripts/render.mjs` | Run it; read only if debugging |
