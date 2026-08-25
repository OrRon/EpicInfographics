# Style name — one-line identity

> Spec for contributing a new design language. Copy this file, fill every
> section, delete nothing. The bar: an agent with zero taste, following only
> this file, produces something recognizably in the style. Every PR adding a
> style must include one rendered example in `examples/`.

## Mood & when to use

2–3 sentences: the feeling, the historical/visual lineage, the subject
matter it suits, and one sentence on when NOT to use it.

## Palette

Exact hexes with roles. Two classes of color:

| Role | Hex | Notes |
|---|---|---|
| `--bg` | | canvas background |
| `--surface` / `--surface-2` | | cards / quiet fills (unfilled waffle cells, meter tracks) |
| `--ink` / `--ink-muted` | | text |
| `--accent-…` | | **decoration accents** — free for shapes, headers, devices |
| `--chart-1…5` | | **chart-safe slots, fixed order** — the only colors data marks may wear |

Chart-safe slots MUST pass the six palette checks (lightness band, chroma
floor, CVD adjacent-pair separation, normal-vision floor, contrast vs `--bg`)
— validate with a palette checker, don't eyeball. Note any WARN and the
compensating rule (e.g. "always direct-labeled"). Decoration accents may be
louder than chart-safe slots, but state the rule that makes them legible
(borders, size, never carrying data).

Usage rules: which colors may touch, what carries emphasis, what the
de-emphasis gray is.

## Typography

- Google Fonts `<link>` tag, ready to paste.
- Display face + body face (+ optional mono), weights used.
- Size scale (5 steps with px values for a 1080px canvas), casing rules,
  letter-spacing where relevant, number styling.

## Geometry & spacing

Corner radii, border weights, shadow spec (exact CSS), spacing scale,
alignment discipline (hard grid? allowed rotation?).

## Chart styling

How THIS style draws marks: bar rounding, gridlines or not, axis treatment,
label typography, gap/border treatment between fills, donut ring weight.

## Signature devices

The 3–5 decorative moves that make the style recognizable, each with enough
CSS/SVG to execute. This is what separates the style from a generic default.

## Do / Don't

5–8 bullets each. Concrete ("Don't center body text") not vague ("keep it
clean").

## CSS tokens (paste into skeleton)

A complete `:root` block defining every variable named above, plus base
element styling (body, headings) so the style is active before any layout
is written.
