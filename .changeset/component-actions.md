---
"@stealthscale/component-actions": minor
---

component-actions: fill a pressed toggle button

- The recipe fills a button while `aria-pressed` is true: `colorPalette.subtle` behind the palette's
  ink, with the palette's edge. A toggle is therefore a button with `aria-pressed`, and the fill and
  what a screen reader announces cannot disagree.
- The button's specimen reads every axis off the recipe and crosses each with every look: the sizes,
  the statuses, both elevations, the effects, the square that holds one glyph, the pressed state and
  the disabled state, each scene under its own word. The words come from the catalogue under
  `button`, and each scene is documented.

component-actions: ripple under every press and hold the box still

- Every button carries the ripple layer style: a press spreads a ripple from the middle of the box
  and the release fades it. The `effect` axis keeps the glow alone, so `effect="ripple"` is gone.
- The box no longer scales to 98 percent under a press. The press is read from the look's pressed
  fill, the ripple and the elevation dropping, and a box that shrinks under the pointer read as
  flinching.
