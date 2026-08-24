# Epic Infographics — Skill Plan

An open-source Claude Code / Agent SDK skill that lets agents produce
polished, varied, print-quality infographic images. Agent writes HTML/CSS
(with inline SVG for charts), a bundled script renders it to PNG with
headless Chromium, and the agent reviews its own output and iterates.

## Core thesis

Three things make agent-generated infographics good, and the skill is built
around all three:

1. **A rich data vocabulary.** Most agents default to "bar chart or bullet
   list." The skill teaches ~20 distinct ways to present data and how to
   pick between them.
2. **Fully-specified design languages.** "Make it pretty" fails; "use the
   Swiss style file: these hexes, these fonts, these rules" succeeds. Each
   style is a self-contained spec an agent can execute without taste.
3. **A render–review–fix loop.** The agent screenshots its work, *reads the
   PNG back*, and fixes overflow/contrast/crowding before delivering. This
   loop is the single biggest quality lever and is mandatory in the
   workflow.

## Repository layout

```
epicinfographics/
├── SKILL.md                      # the router: workflow, decision tree, hard rules
├── README.md                     # humans: what it is, install, example gallery
├── LICENSE                       # MIT
├── CONTRIBUTING.md               # esp. "how to contribute a design language"
├── references/
│   ├── data-vocabulary.md        # the ~20 representations + how to choose
│   ├── charts.md                 # inline-SVG recipes: axes, bars, lines, donuts…
│   ├── layout-patterns.md        # grids, flows, connectors, section rhythm
│   ├── typography-and-numbers.md # big-number callouts, stat hierarchy, units
│   ├── decoration.md             # lines, arrows, badges, textures, dividers
│   ├── canvas-presets.md         # sizes/aspects and their layout implications
│   ├── qa-checklist.md           # the pre-delivery review pass
│   └── design-languages/
│       ├── _template.md          # spec for writing a new style (contributors)
│       ├── swiss.md              # International Style: grid, Helvetica-ish, restraint
│       ├── editorial.md          # magazine feature: serif display, pull-quotes
│       ├── corporate-clean.md    # safe, modern SaaS-report look
│       ├── neo-brutalist.md      # thick borders, raw color, hard shadows
│       ├── dark-glass.md         # dark mode, glassmorphism, glow accents
│       ├── retro-print.md        # 60s/70s poster, grain, limited inks
│       ├── isotype.md            # pictogram-first, Otto Neurath lineage
│       ├── blueprint.md          # technical drawing, monospace, annotation lines
│       ├── hand-drawn.md         # marker/sketch, casual, rounded
│       └── gradient-pop.md       # vivid gradients, big shapes, social-native
├── scripts/
│   └── render.mjs                # HTML → PNG (Playwright), presets, retina scale
├── templates/
│   └── skeleton.html             # canvas boilerplate: reset, tokens, sections
└── examples/
    ├── <name>/brief.md           # the prompt/data that produced it
    ├── <name>/infographic.html   # source
    └── <name>/infographic.png    # committed render (doubles as README gallery)
```

Progressive disclosure keeps context cheap: `SKILL.md` stays under ~400
lines; the agent loads **one** design-language file plus only the reference
files the task needs.

## SKILL.md — the workflow it encodes

1. **Find the story.** Before any visuals: what is the one-sentence
   takeaway? Which numbers are hero, which are support? An infographic is
   an argument, not a data dump.
2. **Pick the canvas.** From `canvas-presets.md`: square social (1080²),
   story/reel (1080×1920), wide/OG (1200×630 or 1920×1080), A4 poster,
   slide (16:9). Aspect drives layout before style does.
3. **Pick the design language.** User's ask > subject-matter fit > default
   (corporate-clean). Load exactly one style file; its tokens are law for
   the rest of the task.
4. **Choose data representations** from `data-vocabulary.md` — deliberately
   varied: a hero stat, then 2–4 *different* representation types. Never
   three bar charts in a row.
5. **Compose the layout** per `layout-patterns.md`: one hero element,
   clear reading flow, consistent spacing scale, sections separated by the
   style's own devices.
6. **Build** a single self-contained HTML file from `skeleton.html`:
   CSS custom properties for the style tokens, inline SVG for all charts
   (recipes in `charts.md`), Google Fonts, no external images.
7. **Render** with `scripts/render.mjs`.
8. **Review the PNG yourself** (Read the image), fix, re-render. Minimum
   one loop; repeat until the `qa-checklist.md` pass is clean.
9. **Deliver** the PNG (and offer the HTML source).

Hard rules (also in SKILL.md):

- No text overflow or ellipsis truncation — resize or rewrite instead.
- One hero element per infographic; everything else is subordinate.
- Every color from the style's palette; every size from its type scale.
- WCAG-ish contrast for all text; data must be readable at 50% zoom.
- Numbers formatted for humans (12.4M, not 12400000), units always shown.
- Cite the data source in a footer when one exists.

## The data vocabulary (the "varied ways to present data")

Grouped by the question the data answers — this is the selection logic:

- **How big?** — big-number callout, proportional bubbles/squares,
  pictogram count (isotype rows), progress meter/gauge.
- **Compared to what?** — bar/column, versus split-panel, slope chart,
  ranked list with data bars, dot plot.
- **What share?** — donut, waffle grid, stacked bar, treemap-lite,
  pyramid/funnel.
- **Over time?** — line/area, timeline (vertical, horizontal, serpentine),
  sparklines, small multiples.
- **How does it work?** — process steps, flow with connectors, cycle
  diagram, decision tree.
- **Where?** — simple map silhouettes with markers (kept deliberately
  lightweight).
- **Relationships?** — Venn, matrix/quadrant, network-lite.

`charts.md` gives each a copy-pasteable inline-SVG recipe with correct
proportion math (the place agents most often get charts wrong), so bars are
actually proportional to values and donut arcs are computed, not eyeballed.

## Design-language file spec (`_template.md`)

Every style file is complete enough to execute with zero taste required:

- **Mood & when to use** (2–3 sentences).
- **Palette** — exact hexes: background, 1–2 surfaces, ink, muted ink,
  4–6 accents, and *the rules for using them* (e.g. "accents never touch").
- **Typography** — Google Fonts pairing, weights, a 5-step size scale,
  casing rules, number styling (tabular figures, etc.).
- **Geometry** — corner radii, border weights, shadow spec, spacing scale.
- **Chart styling** — how this style draws bars, lines, donuts, gridlines.
- **Signature devices** — the 3–5 decorative moves that make the style
  recognizable (Swiss: hairline rules + one red accent; brutalist: 3px
  borders + offset hard shadows; blueprint: dimension lines + stamps).
- **Do / Don't** list.
- **A ~30-line CSS token block** the agent pastes into the skeleton.

## Render script (`scripts/render.mjs`)

- Playwright + Chromium; auto-installs browser on first run
  (`npx playwright install chromium`), documented in SKILL.md.
- `node scripts/render.mjs input.html out.png --preset square|story|wide|a4|og|slide`
  or explicit `--width/--height`; `--scale 2` default for retina-crisp PNG.
- Waits for fonts (`document.fonts.ready`) before screenshotting — the
  classic blank-text failure mode, handled once, centrally.
- Full-page capture when height is `auto` (long-form scrolling
  infographics).

## Distribution & open source

- **License:** MIT. **Repo:** GitHub, standalone skill repo.
- **Install paths:** (a) clone/copy into `~/.claude/skills/` or a project's
  `.claude/skills/`; (b) publish as a Claude Code plugin marketplace entry
  so it's `/plugin`-installable. Support both from day one — the plugin
  wrapper is a tiny manifest around the same skill dir.
- **README as gallery:** committed example PNGs make the repo sell itself —
  this is a visual project; the gallery *is* the pitch.
- **CONTRIBUTING.md** centers on the highest-value contribution: new design
  languages via `_template.md`, with the requirement that every PR adding a
  style includes one rendered example.
- **CI (later):** re-render all examples on PR and diff, so style-file
  edits can't silently rot the gallery.

## Build phases

**Phase 1 — a working core (ship this first)**
SKILL.md + skeleton.html + render.mjs + `data-vocabulary.md` + `charts.md`
+ three styles (corporate-clean, swiss, neo-brutalist — maximally different
from each other). Test end-to-end with real briefs.

**Phase 2 — breadth**
Remaining seven styles, `layout-patterns.md`, `decoration.md`,
`typography-and-numbers.md`, `canvas-presets.md`, `qa-checklist.md`,
long-form/auto-height support.

**Phase 3 — open-source polish**
Examples gallery (8–10 briefs across styles and canvas sizes), README,
CONTRIBUTING, LICENSE, plugin manifest + marketplace listing, CI render
check.

## How we'll know it's good (eval)

Keep a set of ~10 varied test briefs (market stats, a how-to process, a
year-in-review, a comparison, a timeline, a survey result…). After any
significant change, run 3–4 of them fresh and inspect the renders. The bar:
a stranger would believe a human designer made it, and each render across
briefs looks *different* from the others (variety is a stated goal — sameness
is failure). Later, wire the briefs into `claude plugin eval`.

## Open questions

- Skill/repo name: `epic-infographics`? (directory says epicinfographics)
- Node vs Python for the render script (plan assumes Node/Playwright; a
  Python + playwright fallback could be added if users ask).
- Whether to include an optional AI-image-background escape hatch (probably
  not v1 — keep output fully deterministic and self-contained).
