# Motion — staging, not decoration

Animation turns the infographic into a short performance of itself: the
scene is set, the data walks on in a deliberate order, the hero lands with
the strongest beat. It is a *layer on the finished static design*, never a
substitute for one. If the still version is weak, motion makes it weak and
distracting.

## The prime rule

**The final frame IS the infographic.** Every element ends exactly where
the approved static design put it — motion only controls the order and
manner of arrival. Build the piece fully static first (steps 1–11 of the
workflow, preflight clean, PNG reviewed), then add the animation layer to
the same file. `check.mjs` and `render.mjs` scrub all animations to their
end state, so the preflight and the still render keep working unchanged.

## The technical contract

`animate.mjs` pauses the page's animations and scrubs them frame by frame,
so what you write must be scrubbable:

- **CSS `@keyframes` only.** No JS animation loops, no `requestAnimationFrame`,
  no libraries — script-driven motion is invisible to the scrubber and the
  self-containment rule already bans it.
- **Every animation needs a fill mode; pick it by keyframe shape.** For
  *from-only* keyframes (the implicit `to` is the resting state — most
  entrances) use `animation-fill-mode: backwards`: frame-identical to
  `both`, but it leaves no active effect on the finished frame. That
  matters because the still renderer *pauses* animations at their end
  rather than cancelling them, and a still-filling composited animation
  (transform/opacity) keeps its element layerized at screenshot time —
  which shifts antialiasing, most visibly on HTML text. For keyframes
  whose end state differs from the element's base value (draw-ons ending
  at `stroke-dashoffset: 0`) `both` is mandatory or the finish snaps back.
  Never omit the fill entirely — the delay-phase flash is a bug.
- **HTML text entrances prefer non-composited properties** (visibility,
  margin, color) over transform+opacity where the crispest possible still
  matters; transforms on SVG children are essentially free.
- **Stagger with `animation-delay`**, sequence with delays, not with JS.
- **The build must be finite.** Ambient loops (`animation-iteration-count:
  infinite`) are welcome as atmosphere, but the storytelling animations end;
  the script measures total length from the finite ones.
- Animate `transform` and `opacity` where possible (no reflow, no layout
  drift); bars grow with `transform: scaleY()` + `transform-origin`, never
  by animating `height` inside a flex column that would push its neighbors.
- **An SVG element with a `transform` attribute cannot take a CSS transform
  animation** — the CSS value replaces the attribute and the element jumps
  out of place. Fade such elements, or animate a wrapper group instead.
- **A stroke that is already dashed cannot be draw-animated** — the draw-on
  recipe would destroy its dash pattern. Fade pre-dashed strokes in whole.
- When adding a motion class to an element that already has one, merge into
  the existing `class` attribute — a second `class` attribute is silently
  dropped, taking the element's styling with it.

## Choreography — the build order

Storyboard before you write a keyframe: list your elements in the order
the reader should meet them. The canonical order:

1. **The place is already there.** Background, texture, environment exist
   at frame 0 — you do not build the stage while the actors walk on. At
   most the scene *settles* (a slow 5% brightness rise, grain fading in).
   A black first frame is a failed opening shot.
2. **Structure enters**: title block, axes, frames, the drawn object's
   outline — fast and quiet (0.4–0.8s).
3. **Data builds**: bars grow, arcs sweep, paths draw, fills rise, icon
   armies populate. This is the heart of the performance — give it room.
4. **The hero lands last**, with the biggest beat: the count-up finishing
   on the hero number, the fill reaching its true level. The eye must be
   free to watch it, so nothing else moves during the hero's landing.
5. **Support text and footer fade in** almost unnoticed at the end.

Timing discipline: total build 4–8 seconds; individual entrances 0.5–1.2s;
stagger siblings by 80–150ms; only draw-ons and count-ups may run longer
than 1.5s. Two things moving identically at the same time read as one
thing — vary delay, not direction.

**Easing**: arrivals decelerate — `cubic-bezier(.2,.8,.2,1)` is the default
"decisive landing". Count-ups use `ease-out` (fast start, settling on the
final digit). Playful languages (hand-drawn, isometric-world) may overshoot
slightly with something like `cubic-bezier(.34,1.56,.64,1)`; precise ones
(blueprint, editorial, swiss) never bounce.

## Truthful motion

The hard rules about geometry extend to time:

- **Comparable marks animate with the same duration and easing.** If three
  bars grow at different speeds, mid-flight frames show false ratios. Same
  duration everywhere means every intermediate frame is a truthful scaled
  copy of the final chart. Stagger their *delays* if you want sequence.
- **Count-ups end exactly on the value**, not on a rounded neighbor.
- **Never animate an axis or baseline** once data has appeared against it.
- Motion emphasizes the hero, not a supporting fact — the biggest beat and
  the true hero must be the same element.

## Recipes

**Build-in** (structure, text blocks):
```css
.enter { animation: rise .7s cubic-bezier(.2,.8,.2,1) backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(18px); } }
/* from-only keyframes take fill `backwards` (see the contract above) */
```

**Growing bar** (scale, never layout):
```css
.bar { transform-origin: bottom; animation: grow 1s cubic-bezier(.2,.8,.2,1) backwards; }
@keyframes grow { from { transform: scaleY(0); } }
/* horizontal bars: transform-origin: left; scaleX(0) — labels OUTSIDE the
   bar, or they stretch with it; a label inside must enter separately */
```

**Draw-on stroke** (paths, leader lines, story paths):
```css
path.draw { stroke-dasharray: 1500; stroke-dashoffset: 1500;
            animation: draw 1.6s ease-in-out both; }
@keyframes draw { to { stroke-dashoffset: 0; } }
/* 1500 = the path length, or any comfortable overestimate; an exact value
   makes the draw speed even along the path */
```

**Count-up number** (pure CSS, no JS):
```css
@property --n { syntax: '<integer>'; initial-value: 0; inherits: false; }
.count { animation: count 2s ease-out both; counter-reset: n var(--n); }
.count::after { content: counter(n); }
@keyframes count { to { --n: 847; } }
/* formatted values: keep the unit as literal text around the counter
   ("$" before, "M" after); the counter itself must be a plain integer.
   CAVEAT: the digits live in a pseudo-element, which check.mjs cannot
   measure — use count-ups only for standalone numbers with clear space,
   and thousands-separated values ("1,600") bloom in as text instead */
```

**Donut / arc sweep** (dasharray already computed per charts.md):
```css
circle.seg { animation: sweep 1.2s cubic-bezier(.2,.8,.2,1) backwards; }
@keyframes sweep { from { stroke-dasharray: 0 314.16; } }
/* end state stays in the element's static attribute; sweep FROM zero */
```

**Liquid fill** (fill-level metaphors): put the fill rect in a clipPath'd
group and animate `transform: translateY()` from below the vessel to its
computed level.

**Ambient loop** (atmosphere only — particles, steam, a slow drift):
```css
.mote { animation: drift 7s ease-in-out infinite alternate; }
@keyframes drift { to { transform: translate(9px, -14px); } }
/* subtle amplitude, slow period; ambience must never pull the eye from
   the data build */
```

## Loops and the hold

GIFs and social autoplay loop forever. `animate.mjs` freezes the finished
frame for `--hold` seconds (default 1) so each loop ends on a readable
graphic — for text-heavy pieces raise it (`--hold 2`). The cut from final
frame back to frame 0 is visible; a scene that pre-exists at frame 0 (rule
1 above) makes that cut feel intentional instead of broken.

## Reviewing your own motion — mandatory

You cannot watch the video, so render the contact sheet and READ it:

```bash
node scripts/animate.mjs infographic.html infographic.mp4 --preset square --sheet sheet.png
```

The sheet is 8 evenly spaced frames, first to last. Check ruthlessly:

- [ ] Frame 1: is the place already there, or is it an empty void?
- [ ] Does the tile sequence tell the story order you storyboarded?
- [ ] Can you see the stagger (different tiles show different elements
      mid-arrival), or does everything pop at once between two tiles?
- [ ] Mid-build tiles: no text colliding with moving elements, no half
      states that look broken (a bar at scaleY(.1) under its label is fine;
      a label floating over nothing is not).
- [ ] Is the last tile identical to the approved static PNG?
- [ ] Hero: does the biggest visible change across tiles belong to it?

Fix, re-run, re-read. Then deliver the MP4 (and GIF where the destination
wants one) alongside the still PNG.
