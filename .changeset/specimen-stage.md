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

- `Matrix` takes `across`, a second axis, and draws one captioned row per value of the first axis
  holding one captioned cell per value of the second. Every arrangement is the library's `Stack`, so
  a row wraps where it runs out of room. One axis runs across by default.
- `useWords(prefix)` reads the catalogue's `specimen` namespace under a prefix, so a specimen reads
  its words through this package and imports nothing from the i18n foundation. A package keeps a
  page's words as `locales/<language>/specimen/<page>.json`.
- A page's title, its opening and each scene's title and opening are keys the catalogue resolves in
  the language a reader chose, and a key with no entry is shown as the key. A page whose words live
  in another namespace names it with `namespace`, and `Entry` carries it for the rail and the index.
- A group's heading is looked up as `groups.<name>` and shown as the name where no entry exists.
