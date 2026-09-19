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

specimen: centre the matrix's cells and quieten the rail

- A matrix centres each cell in its row once unfolded, so a row of one control at every size reads
  as one line of controls, the way a row of mixed controls lines up on a page.
- The rail names its landmark for a screen reader alone and draws no heading over the list, and the
  row of the page being read is marked by the list's own tint rather than a bar down its edge.
- Each scene stands on an elevated card rather than an outlined one.

specimen: narrow the rail with a search

- `RailSearch` draws the field that narrows the rail: the forms package's search input in the room
  the sidebar keeps for one, named `Filter pages`, with a control that empties it. `Mod+K` puts the
  reader in it from anywhere on the page, through the hotkeys provider, and opens the shell's
  `navbar` panel first where the shell has folded it over the page and closed it. The words are the
  application's state, handed to the field and to the rail alike.
- `Rail` takes `query`. It keeps the pages whose words contain the query, whatever the case, opens
  every branch it leaves standing, and draws the sidebar's empty line, `No pages match`, in place of
  the list where no page does. The words are resolved through each page's namespace, so a rail read
  in another language is filtered on the words a reader sees.
- `useWordings` resolves a key in any namespace named at the call, for a caller reading pages of
  several namespaces. `useWording` is built on it.
- The package peers on `@stealthscale/component-forms` and `@stealthscale/provider-hotkeys`.

specimen: file each page under its group and list its sections beside it

- The trail above a page and the index's title read `Components`, and the group a page is filed
  under stands beside its title as a badge on the neutral palette, worded the way the rail words it.
  A page filed under no group has none.
- Each scene's section is anchored by its worded title, `looks-and-sizes`, through `slugOf`, which
  lowers the case and writes every run of punctuation and space as one hyphen.
- A rail beside the page, `On this page`, lists the sections through the navigation package's table
  of contents in the page's aside. It marks the sections on screen, scrolls the page to the one
  pressed, sticks beside the body on a wide page and leaves a narrow one. A page with no scenes
  draws no rail.
- The page is composed from `Header`, `SceneSection` and `Contents`, one file each.
- The rail reads the sections over the whole viewport, `rootMargin="0px"`, so every section in view
  is marked and the last one is marked once the page reaches its end. The machine's own band leaves
  out the foot of the viewport, and a short last section was never marked.
- The package peers on `@stealthscale/component-data`.
