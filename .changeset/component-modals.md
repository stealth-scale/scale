---
"@stealthscale/component-modals": minor
---

component-modals: rule the palette with hairlines

- The band under the field reads the hairline the `divider()` helper draws, without restating a
  width, and a shortcut's box reads `borderWidths.hairline`.

component-modals: publish Command

- `Command` draws the palette a person opens with a keystroke, types into, and runs one thing from.
  Four parts under one namespace: `Root`, `Input`, `List` and `Empty`.
- Actions go in as data rather than as children. The palette reorders and drops them on every
  keystroke, and children would put the caller in charge of that. One action states its words, its
  value, the heading it is listed under, a mark, the keywords that should find it, the keystroke
  that runs it without the palette, and whether it is listed but cannot be run.
- The field keeps focus and the list never takes it. The field carries `aria-activedescendant`, so a
  screen reader announces the row the arrow keys are on while the caret stays where the reader is
  typing.
- `count` says how many matches are left after each keystroke, announced politely, so a reader who
  cannot see the list still knows whether they have narrowed it to one.
- Matching folds case and accents and reads `keywords` beside `label`, so `jose` finds `José` and
  `add` finds `New document`. The narrowing is `useListCollection`, so the palette holds no matching
  of its own.
- Groups are addressed by position rather than by heading. A heading with a space in it produced an
  identifier that crashed `document.querySelector`, which the machine calls to find the row the keys
  are on.
- One axis: `size`. The field draws no edge of its own, because the palette is the edge round it.

component-modals: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-modals: mark the command palette's focused input

- The control band draws a ring when the input inside it takes focus. The input's own outline is
  removed and nothing replaced it, so an inline palette showed no focused surface.
