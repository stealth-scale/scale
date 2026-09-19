---
"@stealthscale/component-navigation": minor
---

component-navigation: publish NavList

- `NavList` draws the list of destinations a sidebar or a page is moved around by. Ten parts under
  one namespace, with a link, a nested list, a badge and the control that opens a branch.
- It belongs here rather than in the screen package, because what it draws is a way of moving
  between places. The screen package lays out the room it sits in.
- `highlight` marks the destination a reader is on: `bar` draws a rule down its leading edge, `fill`
  fills it solidly, and `tint` fills it faintly. The mark is written against `_currentPage`, which
  is the condition `aria-current="page"` sets, so the mark and what a screen reader announces cannot
  disagree.
- `reveal` decides when the control beside a row is drawn. `always` draws it, and `hover` draws it
  under a pointer, under a coarse pointer that has no hover, and while anything in the row holds
  focus. The rule for the last of those selected `[data-part=action]`, which nothing in this
  repository stamps, so it matched nothing: a keyboard reached a control at `opacity: 0` and a
  pointer revealed none either. It selects the class the binding writes.
- `variant` takes `list` for a column of rows and `dock` for a bar across the foot of a phone, which
  keeps clear of the home indicator through the theme's safe-area spacing.
- `iconic` collapses the list to a rail of marks. Each destination keeps its words under `srOnly`,
  so a screen reader still names it and the words take no room inside the square.
- Six axes: `highlight`, `iconic`, `radius`, `reveal`, `size` and `variant`.

component-navigation: add the inherit axis to Link

- `Link inherit` takes the ink of the words around it in place of the theme's link ink, visited or
  not, and keeps the underline under a pointer and the focus ring. For the title of a card and the
  brand in a bar, where the surface already says the words are pressed.

component-navigation: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-navigation: slide a branch open and draw the rows a sidebar's size

- A branch runs the collapsible machine rather than a flag of its own. The machine measures the list
  beneath the row and writes its height, which the theme's `collapse` motion runs to, so the list
  slides open and closed and the mark on the row turns a quarter as it does. `Branch` takes the
  machine's settings, `open`, `defaultOpen`, `onOpenChange` and `disabled` among them, and its `id`
  names the machine, which builds the references between the row and its list from it.
- A row is as tall as a tag of its size and carries the label, the inset and the gap two steps
  smaller, so a medium list is a column of short rows in the smallest label. A nested list is
  indented by the inset a step smaller and keeps a little room at either end of its rows.
- A group's row is set in the palette's own ink, a step quieter than the page's, and the row of the
  page being read is set in the page's ink and semibold whatever the size states. A hovered row
  takes the palette's subtle fill, which leaves a list on a subtle surface still.

component-navigation: publish Toc

- `Toc` lists the headings on a page and marks the ones on screen. Six parts under one namespace:
  `Root` is the `nav` landmark named by `Title`, `List` holds one `Item` per heading, each holding
  the `Link` to it, and `Indicator` is the mark that slides down the list to the rows whose heading
  is on screen.
- The root runs `@zag-js/toc`. Each item names a heading by its id in the document and its depth.
  The machine watches those elements with an intersection observer, writes `aria-current="location"`
  on the links of the ones on screen, measures their rows and writes the mark's place on the root as
  `--top` and `--height`. A press on a link scrolls the page to the heading. Where `scrollEl` names
  the element the page scrolls in, the press scrolls that element.
- A row is indented one gap for each level under the top through the `--depth` the machine writes. A
  link is muted. It is set in the page's ink and a step heavier while its heading is on screen, and
  it is cut short on one line. The title is set small in capitals and reads as the label of the list
  rather than as a heading of the page.
- One axis, `size`, at `sm`, `md` and `lg`. The links read the body role one step smaller than the
  size and the title reads the label role two steps smaller.
