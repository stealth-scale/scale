# @stealthscale/component-modals

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-modals: rule the palette with hairlines
  
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

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: hold every package to the barrel rule its ADR already states
  
  - ADR-0018 puts a specification beside every source file, the barrels included, and records that the
    conformance suite holds a package to it "where the package asks with `barrels: true`, which every
    component package does". Ten of the sixteen asked for nothing, so the rule was written down and
    enforced nowhere in them.
  - `collections`, `content`, `data`, `disclosure`, `feedback`, `forms`, `modals`, `navigation`,
    `screen` and `surfaces` now ask. The check reported thirteen barrels with no specification beside
    them, each now written: the package barrel of nine of those ten, `screen`'s folding and focus
    barrels, and `collections`' collection barrel.
  - A barrel specification names every export as a sorted list and asserts that neither a recipe nor a
    binding is among them, which is what catches a leaked binding and a dropped export.
  - Forty-three barrels under `foundations/` and `packages/` still have no specification. The ADR's
    decision covers them and its enforcement note does not, so they are left for a pass of their own.
- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-collections@0.1.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
