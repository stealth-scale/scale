---
"@stealthscale/specimen": minor
---

specimen: stand each scene on a stage and draw the index's cards to their measure

- `Page` draws each scene's component inside an outlined `Card`, and draws the backticks in a page's
  or a scene's sentence as `Code` through `marked`.
- `Index` draws its cards in a `fill-xs` grid, outlined, with the title's link in the card's ink and
  stretched over the card.
- `Rail` draws its list at `md` with the `bar` highlight on the page being read.
- A caption sets both halves of its line at the small size.
- The trail matches its route exactly, so a page under the index no longer calls the trail the
  current page.

specimen: cross two axes in a matrix and read a page's words from the catalogue

- `Matrix` takes `across`, a second axis, and draws a grid with a caption along each edge: the
  second axis captioned once across the top, the first once down the side, and one cell per pair
  between them. Each column is as wide as the widest cell in it, so a small size takes a narrow
  column. The grid is the package's `matrix` slot recipe, with one `across` value per count of
  columns, and folds below the middle container size into captioned rows that wrap, each cell then
  showing the caption from the top edge. One axis runs across in a wrapping `Stack` by default, or
  down when asked.
- `valuesOf(recipe, axis)` reads the values an axis offers off the recipe, typed as the recipe's own
  literals, so a specimen turns every value and misses none a theme adds.
- `Tile` draws a block in place of content, so a specimen of a layout has something to arrange: the
  neutral palette's quiet surface with its edge.
- The package publishes its recipes as a preset under `./theme`, which a catalogue's compiler picks
  up from the dependency graph like any component package's.
- `useWords(prefix)` reads the catalogue's `specimen` namespace under a prefix, so a specimen reads
  its words through this package and imports nothing from the i18n foundation. A package keeps a
  page's words as `locales/<language>/specimen/<page>.json`.
- A page's title, its opening and each scene's title and opening are keys the catalogue resolves in
  the language a reader chose, and a key with no entry is shown as the key. A page whose words live
  in another namespace names it with `namespace`, and `Entry` carries it for the rail and the index.
- A group's heading is looked up as `groups.<name>` and shown as the name where no entry exists.
