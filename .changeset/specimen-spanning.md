---
"@stealthscale/specimen": minor
---

specimen: spread a matrix and a board across the card they are drawn on

- A matrix draws its columns as `minmax(min-content, 1fr)` rather than `max-content`, so the columns
  share whatever the card has left instead of packing against its start. A page of scenes read as a
  column of drawings down the left edge with the rest of the card empty.
- The floor is each column's min-content rather than its max-content. A control that sets no width
  of its own reports the two alike and keeps the width it had. A control that fills whatever it is
  given reports a much smaller floor, so a row of them shares the card instead of overflowing it.
- The cells stretch to their columns. `justify-content: start` packed the tracks themselves, which
  is what left the card half empty.
- A matrix holds two rows one step further apart than two cells of one row. A row carries a caption
  of its own at the start of it, and the row gap is what holds that pair together against the pair
  above.
- A board fits its columns rather than filling them. A filled row keeps the columns nobody wrote a
  sample for, so two samples on a wide card each took a quarter of it and anything wider than a
  quarter was cut off. Fitting drops the empty columns, so two samples take half the card each and
  one takes all of it.
- `Sample` still fits its drawing by default. A scene whose component should reach the far side of
  its column states `place="start"`, which is now recorded on the axis: eight fields drawn at
  `start` ask for more than a card holds and the last three fall off the edge.
