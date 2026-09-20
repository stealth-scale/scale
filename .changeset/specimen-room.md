---
"@stealthscale/specimen": minor
---

specimen: add a room, and order the size axis by the scale

- `Room` is a box held to one of the page's measures, `sm` by default, for a scene that reads only
  once the width runs out, such as a row that wraps or a heading cut to one line. Its recipe is
  published with the kit's preset.
- `valuesOf` returns the steps of the size axis in the scale's order, and a value the scale does not
  name after them in the recipe's order. The lint sorts the keys of an axis written by hand, so a
  recipe writing its own steps offered `lg, md, sm, xl, xs` and a page drew the scale out of order.
