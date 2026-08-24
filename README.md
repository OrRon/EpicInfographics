# Epic Infographics

An open-source **agent skill** that lets AI agents (Claude Code, Claude
Agent SDK, and compatible harnesses) create polished, varied infographic
images — stats posters, social graphics, visual summaries, one-pagers.

The agent writes a self-contained HTML/CSS page with hand-computed inline
SVG charts, renders it to PNG with the bundled Playwright script, then
**reviews its own output and fixes it** before delivering.

## What makes the output good

1. **A data vocabulary, not just charts** — ~25 representation forms
   (pictogram counts, waffle grids, slope charts, versus panels, timelines,
   funnels…) organized by the question the data answers.
2. **Fully-specified design languages** — each style is a complete spec
   (exact hexes, font pairings, geometry, signature devices, do/don'ts)
   with CVD-validated chart palettes, so an agent needs zero taste to
   execute it. Shipping now: `corporate-clean`, `swiss`, `neo-brutalist`,
   `retro-print`, `editorial`, `dark-glass`, `blueprint`, `hand-drawn`.
3. **Anti-slop machinery** — a mandatory visual-metaphor step (the drawn
   object carries real data: a cup whose fill level IS the statistic),
   named composition patterns that ban the card-grid dashboard default,
   texture recipes (film grain, halftone, print misregistration) in pure
   SVG/CSS, and art-directed palettes (no framework hexes, no emoji, no
   default font stack). The bar is **scene, not layout**: the canvas is a
   place (a drafting sheet, deep space, a sketchbook page), never an
   arrangement of graphics on a plain ground.
4. **A mandatory render–review–fix loop** — the agent reads its rendered
   PNG back and checks overflow, hierarchy, truthful proportions,
   contrast, and an anti-slop checklist before you ever see it.

## Install

```bash
git clone https://github.com/OrRon/EpicInfographics.git
# Claude Code — project-level:
cp -r EpicInfographics your-project/.claude/skills/epic-infographics
# or user-level:
cp -r EpicInfographics ~/.claude/skills/epic-infographics
```

One-time render setup (inside the skill directory):

```bash
npm install && npx playwright install chromium
```

Then just ask your agent: *"make me an infographic about …"*

## Gallery

Every example was produced by the skill itself (brief + HTML source in
`examples/`; test briefs in [`examples/briefs.md`](examples/briefs.md)):

| | |
|---|---|
| ![Rocket — blueprint, story](examples/rocket-launch/infographic.png) *Orbital launch · blueprint · story* | ![Buildings — blueprint, a4](examples/tallest-buildings/infographic.png) *Tallest buildings · blueprint · a4* |
| ![Funnel — dark-glass, square](examples/launch-funnel/infographic.png) *Signup funnel · dark-glass · square* | ![Streaming — dark-glass, wide](examples/streaming-wars/infographic.png) *The streaming wars · dark-glass · wide* |
| ![Sleep — editorial, story](examples/sleep/infographic.png) *The case for sleep · editorial · story* | ![Pizza — hand-drawn, square](examples/pizza-anatomy/infographic.png) *Anatomy of a margherita · hand-drawn · square* |
| ![Honeybee — retro-print, a4](examples/honeybee-economy/infographic.png) *The honeybee economy · retro-print · a4* | ![Coffee — naturalist-plate, a4](examples/coffee-botanical/infographic.png) *The coffee tree · naturalist-plate · a4* |
| ![Attention — dark-glass, story](examples/attention-spotlight/infographic.png) *The spotlight is shrinking · dark-glass · story* | ![Work worlds — isometric-world, wide](examples/remote-vs-office-worlds/infographic.png) *Two tiny worlds of work · isometric-world · wide* |
| ![Web road — isometric-world, story](examples/web-history-road/infographic.png) *The road the internet took · isometric-world · story* | |

## Repository layout

```
SKILL.md                        the agent's entry point: workflow + hard rules
references/
  data-vocabulary.md            which form fits which data
  charts.md                     inline-SVG recipes with correct math
  design-languages/             one complete spec per style (+ _template.md)
templates/skeleton.html         canvas boilerplate
scripts/render.mjs              HTML → PNG (Playwright, font-safe, retina)
examples/                       brief + HTML + rendered PNG per example
```

## Contributing

The highest-value contribution is a **new design language**: copy
`references/design-languages/_template.md`, fill every section, validate
your chart palette (CVD-safe), and include one rendered example. See
CONTRIBUTING.md (coming with Phase 3).

## License

MIT
