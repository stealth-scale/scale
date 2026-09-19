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
