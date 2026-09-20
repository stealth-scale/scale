---
"@stealthscale/component-content": minor
---

component-content: edge the code block with a hairline

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
