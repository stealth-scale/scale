# @stealthscale/component-content

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`2e97f7e`](https://github.com/stealth-scale/scale/commit/2e97f7e8fd2064f07370a9dd06fe86d8e80ad7e8) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-content: edge the code block with a hairline
  
  - The code block's edge reads `borderWidths.hairline` rather than the reference width `sm`.
  
  component-content: add the code block over the highlighter
  
  - `CodeBlock.Root` holds the code and its language and draws the panel in the dark mode whatever the
    page is in, or light, or in the page's own mode through `mode`. `Header`, `Title` and `Control`
    head it, `Content` is the box the code scrolls in, and `Code` cuts the passage into tokens with
    `@tanstack/highlight` and writes each kind as `data-token`.
  - The recipe inks each kind from the theme's code family: `code.keyword`, `code.string`,
    `code.number`, `code.function`, `code.type`, `code.tag`, `code.attr` and `code.comment`, with a
    diff's lines in `code.inserted` and `code.deleted`. The highlighter's finer kinds fold into those.
  - The block draws no copy control. A page puts the clipboard's trigger from the actions package in
    the control, drawn as the library's icon button.
  - The recipe offers `size` at `sm` and `md`, which sets the code role and the header a step down.
  
  component-content: copy a block's code from the block
  
  - `CodeBlock.Copy` copies the code the root holds, so a page composes the control rather than wiring
    the clipboard itself. The same wiring was written twice: once in the catalogue and once in this
    package's own specimen, and each passed the passage a second time where the root held it already.
  - The part takes the marks and the words from the page. This package ships no icon set and no words,
    and a control that names itself in one language names itself wrongly in every other.
  - The package depends on `@stealthscale/component-actions` at run time, which is the first such edge
    between two component packages. The clipboard machine and the icon button are the library's answer
    to this, and a block that wired its own would be a second one.

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
- Updated dependencies [[`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
