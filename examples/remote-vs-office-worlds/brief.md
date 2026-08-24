# Brief — remote-vs-office-worlds

- **Style:** isometric-world
- **Canvas preset:** wide (1920×1080)
- **Brief:** two ways to work as two tiny floating worlds — a home-desk
  diorama and an office-floor diorama — with the survey data built INTO
  the scenes.
- **Footer note:** fictional survey, n=1,000 — illustrative demo data

## Data (fictional survey, n = 1,000)

- Preference: remote 58% · hybrid 31% · office 11%
- Remote world: +51 min saved commuting per day · 68% report better focus
- Office world: 71% say onboarding is easier · 62% miss real whiteboards

Use ONLY this data; rephrasing allowed, no new statistics.

## Story

Most of the 1,000 surveyed workers would move to the remote world (58%) —
it saves them 51 minutes of commuting a day and 68% focus better there —
but the office world keeps real pulls (easier onboarding, real
whiteboards), and a third of workers want to live on the road between the
two.

**Where is the reader standing?** Hovering in a pale sky over three tiny
floating dioramas — a big home world, a small office world, and a hybrid
stop on the commuter route between them.

## Design decisions

- **Composition pattern:** Big Object — one connected diorama scene of
  three floating slabs dominates the canvas; the dashed commuter path is
  the story path threading them together. Dense zone: the remote world
  (left). Empty zone: the upper-middle sky (clouds + balloon).
- **Metaphor:** ways of working as miniature floating worlds; the
  commute as a literal road between them (and a barricaded road stub on
  the remote world — the commute that no longer happens).
- **Size mapping (truthful geometry):** slab TOP AREA ∝ preference
  share. Slab footprints are squares of side s, drawn as 2:1 iso
  diamonds, so screen area ∝ s². s_remote = 400 ⇒ 58%;
  s_hybrid = 400·√(31/58) = 292.4 ⇒ 31%; s_office = 400·√(11/58) = 174.2
  ⇒ 11%. Stated in the standfirst and footer.
- **Data carried by the scene:**
  - Slab areas → 58 / 31 / 11 preference split (plus a labeled cluster
    per world: hero 58%, hybrid 31%, office 11%).
  - Focus tank (cylinder meter, filled to 68% of its height) on the
    remote slab → "68% report better focus".
  - Barricaded commuter road stub off the remote slab → "+51 min saved
    per day" tag.
  - Freestanding whiteboard prop on the office slab → "62% miss real
    whiteboards" tag.
  - Onboarding door + welcome mat on the office slab → "71% say
    onboarding is easier" tag.
- **Forms used:** proportional areas (hero) · big-number callout (58%) ·
  tank meter (68%) · signpost/billboard tags (51 min, 71%, 62%) · story
  path (dashed commuter route with a walking figure).
- **Series slots:** remote `--chart-1` coral · hybrid `--chart-2` teal ·
  office `--chart-3` indigo · amber `--chart-4` for wood/props.
- **Projection:** every iso coordinate computed from
  X = X0 + (x−y)·0.866, Y = Y0 + (x+y)·0.5 − z (generated
  programmatically, arithmetic noted in HTML comments). Sun upper-right:
  tops lightest, +x faces base color, +y faces dark, everywhere.
