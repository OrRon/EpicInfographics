<div align="center">

# Epic Infographics

### Infographics that don't look AI-made.

**An open-source skill that teaches AI agents to design infographics like a studio, not a dashboard.**

No stock templates. No rounded-card grids. No Tailwind blue. No emoji icons.
Every image below was produced by the skill itself — brief in, PNG out, unedited.

</div>

<br>

![The streaming wars — dark-glass style](examples/streaming-wars/infographic.png)

<table>
<tr>
<td width="50%"><img src="examples/attention-spotlight/infographic.png" alt="The spotlight is shrinking — dark-glass story"></td>
<td width="50%"><img src="examples/coffee-botanical/infographic.png" alt="The coffee tree — naturalist plate"></td>
</tr>
</table>

## Why this exists

Ask an AI for an infographic and you get the same thing every time: rounded
cards in a symmetric grid, Tailwind blue, an emoji where an icon should be,
a bar chart floating on a flat background. Technically fine. Instantly
recognizable as machine-made.

This skill encodes the difference as *procedure*, not taste:

- **The canvas is a place, not a page.** Every piece builds a scene — a
  drafting sheet, a dark theatre, a naturalist's folio, a miniature world —
  and the data lives *inside* it. Flat graphic minimalism is treated as a
  failure mode, even when it's tidy.
- **The drawn object carries the data.** A cup filled to ⅔ because 2 in 3
  adults drink coffee. A rocket whose hatched section is exactly the 90%
  propellant fraction. A funnel of stage-light drawn at 1px = 140 users.
- **Charts are computed, never eyeballed.** Bar ratios, donut arcs, and
  areas come from arithmetic written into the file. Palettes are validated
  for color-blind safety with a checker, not vibes.
- **The agent reviews its own render.** Every graphic is screenshotted,
  read back, and checked against a hard anti-slop list — the no-text
  squint test, the template test, the flat-ground test — before you see it.

## The gallery

Eleven briefs, ten design languages, six canvas formats. Click any image
for its brief and HTML source.

<table>
<tr>
<td align="center" width="33%"><a href="examples/rocket-launch/"><img src="examples/rocket-launch/infographic.png"></a><br><b>Orbital launch</b><br><sub>blueprint · story</sub></td>
<td align="center" width="33%"><a href="examples/tallest-buildings/"><img src="examples/tallest-buildings/infographic.png"></a><br><b>Tallest buildings</b><br><sub>blueprint · a4</sub></td>
<td align="center" width="33%"><a href="examples/launch-funnel/"><img src="examples/launch-funnel/infographic.png"></a><br><b>Signup funnel</b><br><sub>dark-glass · square</sub></td>
</tr>
<tr>
<td align="center" width="33%"><a href="examples/streaming-wars/"><img src="examples/streaming-wars/infographic.png"></a><br><b>The streaming wars</b><br><sub>dark-glass · wide</sub></td>
<td align="center" width="33%"><a href="examples/sleep/"><img src="examples/sleep/infographic.png"></a><br><b>The case for sleep</b><br><sub>editorial · story</sub></td>
<td align="center" width="33%"><a href="examples/pizza-anatomy/"><img src="examples/pizza-anatomy/infographic.png"></a><br><b>Anatomy of a margherita</b><br><sub>hand-drawn · square</sub></td>
</tr>
<tr>
<td align="center" width="33%"><a href="examples/honeybee-economy/"><img src="examples/honeybee-economy/infographic.png"></a><br><b>The honeybee economy</b><br><sub>retro-print · a4</sub></td>
<td align="center" width="33%"><a href="examples/coffee-botanical/"><img src="examples/coffee-botanical/infographic.png"></a><br><b>The coffee tree</b><br><sub>naturalist-plate · a4</sub></td>
<td align="center" width="33%"><a href="examples/attention-spotlight/"><img src="examples/attention-spotlight/infographic.png"></a><br><b>The spotlight is shrinking</b><br><sub>dark-glass · story</sub></td>
</tr>
<tr>
<td align="center" width="33%"><a href="examples/remote-vs-office-worlds/"><img src="examples/remote-vs-office-worlds/infographic.png"></a><br><b>Two tiny worlds of work</b><br><sub>isometric-world · wide</sub></td>
<td align="center" width="33%"><a href="examples/web-history-road/"><img src="examples/web-history-road/infographic.png"></a><br><b>The road the internet took</b><br><sub>isometric-world · story</sub></td>
<td align="center" width="33%"><br><b>Your brief here</b><br><sub>the skill made all of these —<br>test briefs in <a href="examples/briefs.md">examples/briefs.md</a></sub></td>
</tr>
</table>

## The design languages

Each style is a complete, executable spec — exact hexes, font pairings,
geometry, signature devices, do/don'ts — so the agent needs zero taste to
hit it. Every chart palette passes a six-check color-blind-safety
validation, including the dark-mode ones.

| Scene-native (the defaults) | |
|---|---|
| **blueprint** | cyanotype drafting sheet — dimension arrows, hatch fills, stamped title block |
| **dark-glass** | luminous data on deep space — aurora fields, glass panels, disciplined glow |
| **naturalist-plate** | 19th-century field-guide engraving — figure systems, watercolor tints, foxing |
| **isometric-world** | miniature floating dioramas — data as architecture, exact 2:1 projection |
| **retro-print** | mid-century poster — four inks, misregistration, film grain, arc text |
| **editorial** | magazine feature — Fraunces at huge sizes, drop caps, charticles |
| **hand-drawn** | marker sketchbook — wobble-filtered linework, washi tape, doodle arrows |

| High slop-risk (explicit request only) | |
|---|---|
| **swiss** · **corporate-clean** · **neo-brutalist** | flat by construction; the skill only uses them when asked, and forces scene-craft into them |

## Install

**Claude Code / Claude Agent SDK**

```bash
git clone https://github.com/OrRon/EpicInfographics.git
# project-level:
cp -r EpicInfographics your-project/.claude/skills/epic-infographics
# or user-level:
cp -r EpicInfographics ~/.claude/skills/epic-infographics
```

One-time render setup (inside the skill directory):

```bash
npm install && npx playwright install chromium
```

> The renderer needs a real browser engine because the graphics are
> HTML/CSS — that's what buys real text wrapping, web fonts, backdrop
> blur, and blend modes. Playwright drives headless Chromium, waits for
> fonts before screenshotting, and renders at 2× for retina-crisp PNGs.
> It's render-side only: the HTML sources open in any browser.

## Quickstart

Then just talk to your agent:

```text
make me an infographic about our Q3 numbers — dark and dramatic, 16:9
```

```text
turn this data into a poster for the office printer  [paste a table]
```

```text
a fun square social graphic about how sourdough works, hand-drawn style
```

The agent will find the story, pick a visual metaphor that can carry real
data, choose a canvas and design language, compose a scene, build it,
render it, and review its own PNG against the checklist before handing it
over — usually with one or two self-correction loops you never see.

## How it holds quality

- **Rule zero:** *where is the reader standing?* If the answer is "looking
  at a well-designed page," the agent must start over.
- **Truthful geometry, always** — no eyeballed proportions, no dual axes,
  zero-based bars, area ∝ value.
- **No invented data.** Supplied or researched figures only; illustrative
  data is labeled as such in the footer of every example.
- **Validated color** — every palette (light and dark) passes lightness,
  chroma, contrast, and colorblind-separation checks before it ships.
- **The render–review–fix loop is mandatory** — minimum one pass, with a
  checklist that treats "could be a dashboard template" as a hard fail.

## Architecture

```
SKILL.md                        entry point: workflow + hard rules (kept short)
references/
  composition.md                rule zero + six named composition patterns
  illustration-and-texture.md   metaphor-first method, grain/halftone/misregistration
  data-vocabulary.md            ~25 data forms, chosen by the question the data answers
  charts.md                     inline-SVG recipes with the math written out
  design-languages/             one complete spec per style (+ _template.md)
templates/skeleton.html         canvas boilerplate
scripts/render.mjs              HTML → PNG · 6 presets · font-safe · retina
examples/                       brief + HTML + PNG for every gallery image
```

Progressive disclosure: for any one graphic the agent loads `SKILL.md`,
*one* style file, and only the references the task needs.

## Contributing

The highest-value contribution is a **new design language**. Copy
[`references/design-languages/_template.md`](references/design-languages/_template.md),
fill every section, validate your chart palette (CVD-safe — don't eyeball
it), and include one rendered example produced through the skill. PRs that
add a style without a rendered example won't be merged; the gallery is the
test suite.

## License

MIT — use it, fork it, ship it.
