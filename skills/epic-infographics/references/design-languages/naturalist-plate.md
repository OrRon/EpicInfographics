# Naturalist Plate — the field-guide engraving

## Mood & when to use

A 19th-century natural-history plate: aged paper, engraved line shading,
Latin captions, figure numbers, specimen pins, a ruled double frame. Feels
collected, patient, museum-worthy. For anything that can be treated as a
specimen or dissected subject: food, plants, animals, objects, "anatomy
of X", taxonomies, process-as-lifecycle. Don't use it for breaking-news
energy or product marketing.

**Composition note:** this style IS a scene — the reader is leafing
through a naturalist's folio. Big Object (one dissected specimen) or
Specimen sheet (a collection, each item numbered "Fig. 1…N"). The plate
chrome (frame, plate number, captions) is mandatory world-building.

## Palette

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#F3ECDA` | aged paper |
| `--surface` | `#EDE3CB` | caption panels (rare), scale-bar knockouts |
| `--surface-2` | `#E0D3B4` | quiet fills, unfilled cells |
| `--ink` | `#3A3226` | walnut ink — text, engraving lines |
| `--ink-muted` | `#7C7060` | secondary text, hatching |
| `--chart-1` | `#4E7A34` | botanical green |
| `--chart-2` | `#3A6FB0` | prussian blue |
| `--chart-3` | `#8F2F28` | madder red |
| `--chart-4` | `#9A7104` | ochre |
| `--de-emphasis` | `#C9BC9E` | context marks |

Slots validated CVD-safe in this order. Illustration fills are these same
inks as **watercolor tints** — the slot color at 45–65% opacity over the
paper, with full-strength color reserved for data marks and small accents
(hand-tinted engraving, not flat vector).

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
```

- Display: **Cormorant Garamond** 600/700 — titles, plate headings, big
  numerals. Letterspaced UPPERCASE (+0.12em) for the main title.
- Body/captions: **EB Garamond** 400/500; *italic* for Latin names,
  asides, and figure captions.
- Scale (1080px canvas): title 54–72px · Latin subtitle 22px italic ·
  section/figure labels 15px small-caps (`font-variant: small-caps`) ·
  body 16px · captions 13px italic. Hero numeral 100–160px Cormorant 600.
- Figure tags: "Fig. 1." in small caps; measurements in EB Garamond with
  old-style feel.

## Geometry & spacing

- Radii 0. No shadows — depth is **engraved hatching**: fine parallel
  1px `--ink-muted` lines (SVG pattern or repeating-linear-gradient at
  0.35 opacity) following the shaded side of forms; cross-hatch for the
  darkest zones.
- **The plate frame**: a double rule (2px + 1px, 8px apart) inset ~28px
  from the canvas edge; all content lives inside except elements that
  deliberately overlap the frame (one specimen tip may cross it).
- Spacing scale: 8 / 16 / 24 / 44 / 68.

## Chart styling

- Prefer diegetic instruments: a **scale bar** ("0 —— 2 cm" style) for
  magnitude, specimen counts as pinned rows, life-cycle stages as a
  numbered circle of drawings, proportions as apothecary-style divided
  bars with small-caps labels.
- Conventional bars (when needed): thin (≤ 18px), watercolor-tint fill +
  1px ink outline, square ends, values in EB Garamond.
- Every mark direct-labeled with a leader line: thin 1px ink, ending in a
  4px open circle at the subject; label at the other end, never overlapping
  the drawing.

## Signature devices

1. **The plate header**: "PLATE VII." centered small-caps at top, title in
   letterspaced Cormorant beneath, Latin binomial in italic under it.
2. **Engraved specimen**: the subject drawn in 1–2px ink linework with
   hatched shading and watercolor-tint fills that sit slightly loose
   (2–3px offset) from the lines.
3. **Figure system**: every drawn element tagged "Fig. 1." … with a
   caption strip at the plate's foot listing all figures.
4. **Foxing & age**: 3–5 faint blotches (radial-gradients, 3–6% ink) and
   a vignette of slightly darker paper at the frame edge; grain overlay at
   low opacity (0.2).
5. **Specimen pin or tape**: one item pinned (drawn pin with tiny shadow)
   or held by a paper tab — the collector's hand made visible.
6. **The annotated dimension**: a real measurement drawn as a fine
   double-arrow with its value in italic.

## Do / Don't

- **Do** hatch shadows; never use blur or box-shadow.
- **Do** put a Latin (or faux-taxonomic) binomial under the title.
- **Do** number every figure and caption it at the foot.
- **Don't** use flat saturated fills — everything colored is a tint over
  paper with ink linework.
- **Don't** use sans-serifs anywhere.
- **Don't** break the plate fiction with UI chrome (chips, panels, pills).
- **Don't** exceed the four ink hues.

## CSS tokens

```css
:root {
  --bg:#F3ECDA; --surface:#EDE3CB; --surface-2:#E0D3B4;
  --ink:#3A3226; --ink-muted:#7C7060;
  --chart-1:#4E7A34; --chart-2:#3A6FB0; --chart-3:#8F2F28; --chart-4:#9A7104;
  --de-emphasis:#C9BC9E;
  --font-display:'Cormorant Garamond',serif; --font-body:'EB Garamond',serif;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:44px; --space-5:68px;
  --radius:0;
}
body { font-family:var(--font-body); color:var(--ink); background:var(--bg); }
h1,.display { font-family:var(--font-display); font-weight:600; line-height:1;
              text-transform:uppercase; letter-spacing:.12em; }
.latin { font-style:italic; font-family:var(--font-body); }
.figtag { font-variant:small-caps; letter-spacing:.08em; }
.frame { position:absolute; inset:28px; border:2px solid var(--ink); pointer-events:none; }
.frame::after { content:''; position:absolute; inset:6px; border:1px solid var(--ink); }
```
