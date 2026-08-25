# Contributing

Thanks for wanting to make agent-made infographics less recognizable as
agent-made. Two kinds of contribution matter most here, in this order.

## 1. A new design language (highest value)

1. Copy [`skills/epic-infographics/references/design-languages/_template.md`](skills/epic-infographics/references/design-languages/_template.md)
   and fill in every section: palette hexes, font pairings, geometry,
   signature devices, do's and don'ts. If an agent can't execute the style
   without taste of its own, the spec isn't done.
2. Validate the chart palette for color-blind safety: lightness spread,
   chroma discipline, contrast against the style's grounds, and pairwise
   separation under deuteranopia, protanopia and tritanopia simulation.
   Don't eyeball it, use a CVD simulator.
3. Mention the style in `SKILL.md` step 4 so the router can actually pick
   it (CI enforces this).
4. Include one rendered example produced through the skill: a new
   `examples/<name>/` directory with `brief.md`, `infographic.html` and
   `infographic.png`, plus a gallery row in the README.

PRs that add a style without a rendered example won't be merged. The
gallery is the test suite.

The bar every submission is judged against: the canvas must be a place,
not a page. If your style produces type and shapes on a flat ground, it
will be classified as high slop-risk or rejected. See rule zero in
[`references/composition.md`](skills/epic-infographics/references/composition.md).

## 2. A new example for an existing style

Same triplet (`brief.md`, `infographic.html`, `infographic.png`), produced
end-to-end through the skill: brief in, PNG out, unedited. Examples that
survive the SKILL.md anti-slop checklist and show a form or composition the
gallery doesn't have yet are very welcome.

## Ground rules for all PRs

- Examples must be self-contained HTML: inline SVG, inline CSS, Google
  Fonts via `<link>` only, no other external resources, no JS frameworks.
- No invented data presented as fact. Use real sourced figures (cite the
  source in the footer) or label the values as illustrative.
- Geometry must be truthful. Bar ratios, arc angles and areas are computed
  from the values, never eyeballed.
- Run the checks before pushing:

```bash
node scripts/validate.mjs                     # manifests, examples, skill routing
cd skills/epic-infographics
npm install && npx playwright install chromium # once
node scripts/render.mjs ../../examples/<name>/infographic.html /tmp/out.png --preset <preset>
```

CI runs the same validator plus a headless render smoke test on every PR.

## Releases

Versions are synchronized across all plugin manifests. Don't edit a
version by hand, run:

```bash
node scripts/bump-version.mjs 0.2.0
```
