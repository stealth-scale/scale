---
"@stealthscale/specimen": minor
---

specimen: draw every cell as a sample and lay them on equal columns

- `Sample` is one captioned drawing of a component: the caption, the component, and a box whose look
  and placement are its axes. A matrix and a board both draw their cells as samples, so a page that
  crosses an axis and a page laid out by hand read alike.
- `Board` arranges the samples a specimen writes itself, on the library's grid. It takes the grid's
  columns, gap, alignment and flow, and states the look of every sample on it once. Use it where the
  drawings are not one per value of an axis.
- A matrix of one axis lays its cells on the same grid rather than in a wrapping stack. Cells took
  their own widths before, which put the captions at uneven intervals and left a ragged edge down
  the page. The columns default to as many of the smallest measure as the room holds, whether or not
  there are samples for all of them, so two scenes of one page line up with each other.
  `direction="column"` still draws one cell per row, and `columns` overrides both.
- A sample's box fits what it holds until `place` asks for the cell. A box wider than the component
  frames the room beside it rather than the component.
- `Scene` takes a `frame`: `inset` leaves the card's own room, `bleed` takes it back so a component
  that is already a panel meets the card's edges, and `bare` drops the card's surface.
- The caption moved out of the matrix, because a sample captions itself and a matrix captions the
  edges of a crossed grid.
- The catalogue's passages read `CodeBlock.Copy` rather than wiring the clipboard themselves.
