---
"@stealthscale/specimen": minor
---

specimen: hold a scene to the width the viewport states

- Each scene is drawn on a `Stage`, a box inside the card's content that the page holds to the width
  the viewport states: a phone at the smallest measure, or where one of the theme's breakpoints
  starts, read from the breakpoint tokens. The card, the page and the chrome around them keep their
  own width. The library's screen components fold on their own width and a matrix folds on the room
  it is given, so holding the box a scene is drawn in is what shows a reader how a component folds
  on a phone or a tablet. Nothing is loaded again in a frame. A held stage shows its edge as a
  dashed hairline a gap outside its box, so the width can be seen against the card.
- A scene that bleeds keeps its bleed only while the stage fills the card. Held to a width the card
  is wider than, it is drawn in the card's content instead, because a stage bled to one edge and
  short of the other read as a panel cut off. The card is measured for that, the way every screen
  component measures itself.
- `PHONE`, `widthsOf` and `stageWidthOf` are published, so a switcher in an application's bar offers
  the same widths the stage knows and agrees with it on the pixels.
- The package peers on `@stealthscale/provider-viewport`.
