# Brief — streaming-wars

- **Style:** dark-glass
- **Canvas preset:** wide (1920×1080)
- **Brief:** "who's winning streaming in 2026"
- **Footer note:** fictional market — illustrative demo data

## Data (fictional market)

- Subscribers (millions): StreamMax 260 · VidPlus 220 · NebulaTV 150 · Kanal+ 90 · others 120
- Average subscription price 2019→2026 ($): 9.0 · 10.0 · 11.0 · 12.5 · 14.0 · 15.5 · 16.5 · 18.0
- 41% of subscribers are now on ad-supported tiers
- Average 3.4 services per household

Use ONLY this data; rephrasing allowed, no new statistics.

## Story

StreamMax leads the fictional streaming war — but the price of watching has
doubled since 2019, ads are back for 41% of subscribers, and households are
stacking 3.4 services on average.

## Design decisions

- **Composition pattern:** Big Object — a constellation of glowing
  play-button orbs (circle area ∝ subscribers) dominates the left ~60%;
  the "others" orb bleeds off the bottom edge; the Kanal+ orb slides
  behind the glass price panel (boundary crossing).
- **Metaphor:** streaming services as a constellation of glowing play
  buttons in deep space — the orbs ARE the subscriber chart.
- **Forms used:** proportional circles (hero) · glowing line/area chart
  (price) · waffle grid (41% ad tiers) · clipped pictogram screens
  (3.4 services/household).
- **Series slots:** StreamMax `--chart-1`, VidPlus `--chart-2`,
  NebulaTV `--chart-3`, Kanal+ `--chart-4`, others `--chart-5`.
  Single-series support charts use `--chart-1`/accent blue.
