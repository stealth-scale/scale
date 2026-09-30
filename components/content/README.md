# @stealthscale/component-content

Renders a body of content: a passage of code, terminal output or the diff between two versions of a
passage, a Markdown document, a JSON value as a tree, and a strip of items that moves in a loop.
Each component binds a recipe, so a theme restyles it by extending the recipe. The preset under
`./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-content
```

The package peers on `react`, `@stealthscale/theme`, `@stealthscale/hooks` and
`@stealthscale/component-primitives`, whose preset styles the scroll areas. It depends on these:

- `@tanstack/highlight`, which splits a passage of code into tokens.
- `diff`, which compares two versions of a text line by line and word by word.
- `@tanstack/markdown`, which parses Markdown into a document tree.
- `@stealthscale/component-actions` for the copy control and the marquee's pause control.
- `@stealthscale/component-collections` for the JSON tree's `TreeView` and a document's tables.
- `@stealthscale/component-a11y`, `-feedback`, `-layout`, `-navigation` and `-typography` for the
  components a Markdown document renders.
- `@zag-js/json-tree-utils`, which turns a value into the tree's nodes, and `@zag-js/marquee`, which
  times the marquee.

## CodeBlock

A panel with a header over a passage of code that scrolls sideways unless it wraps. The recipe
colours each token kind from the theme's `code` family: `code.keyword`, `code.string` and the rest.

```tsx
import { CodeBlock } from "@stealthscale/component-content";
import { CheckIcon, CopyIcon } from "lucide-react";

<CodeBlock.Root code={source} language="tsx">
  <CodeBlock.Header>
    <CodeBlock.Title>send.tsx</CodeBlock.Title>
    <CodeBlock.Control>
      <CodeBlock.Copy copied={<CheckIcon aria-hidden size="1em" />} label="Copy the code">
        <CopyIcon aria-hidden size="1em" />
      </CodeBlock.Copy>
    </CodeBlock.Control>
  </CodeBlock.Header>
  <CodeBlock.Content>
    <CodeBlock.Code />
  </CodeBlock.Content>
</CodeBlock.Root>;
```

| Part       | Element  | What it renders                                                            |
| ---------- | -------- | -------------------------------------------------------------------------- |
| `Root`     | `div`    | The panel. It takes the code, the language, the colour mode and `before`   |
| `Header`   | `div`    | A row with the title at the start and the controls at the end              |
| `Title`    | `div`    | A file name or another label, truncated on one line                        |
| `Control`  | `div`    | The group of controls at the end of the header                             |
| `Copy`     | `button` | A ghost icon button that copies the root's code                            |
| `Content`  | `pre`    | The code's text, as the content of a scroll area that scrolls sideways     |
| `Code`     | `code`   | The highlighted code, one `span` per classified token or styled run        |
| `Diff`     | `div`    | The diff from `before` to the code, in a scroll area that scrolls sideways |
| `DiffStat` | `span`   | The lines the diff adds and removes, such as "+3 −1"                       |

| Axis   | Values     | Default |
| ------ | ---------- | ------- |
| `size` | `sm`, `md` | `md`    |
| `wrap` | `true`     | off     |

`language` takes the highlighter's language names, such as `tsx`, `ts`, `json`, `shell` and `yaml`,
or `ansi` for terminal output. An absent or unknown language renders plain text.

`mode` sets the panel's colour mode: `dark` by default on any page, `light` on any page, or
`inherit` to follow the page.

`CodeBlock.Copy` takes the idle icon as its children and the copied icon as `copied`. `label` and
`copiedLabel` set its accessible name and default to "Copy to clipboard" and "Copied to clipboard".

A line wider than the panel scrolls the code sideways in the primitives package's scroll area, under
the theme's thin bar. While a line overflows, the area's viewport is a `region` in the tab order and
the arrow keys scroll it. While the code fits, it has no role and no tab stop. The region is named
by `CodeBlock.Title` while one renders, and otherwise by `label` on `CodeBlock.Content`, which
defaults to "Code". `CodeBlock.Content` takes no `as`.

`wrap` breaks a line of `CodeBlock.Code` at the panel's edge in place of scrolling it sideways, and
breaks inside a word where a path or an address has no other break. A diff scrolls.

The panel shows a focus ring while the scrolling region has focus.

### Terminal output

`language="ansi"` renders a process's output in the colours, weight and underline its SGR escapes
set.

```tsx
<CodeBlock.Root code={output} language="ansi" wrap>
  <CodeBlock.Header>
    <CodeBlock.Title>test-run.log</CodeBlock.Title>
  </CodeBlock.Header>
  <CodeBlock.Content>
    <CodeBlock.Code />
  </CodeBlock.Content>
</CodeBlock.Root>
```

- The output reads SGR codes 0 to 2, 4, 22, 24, 30 to 39 and 90 to 97. A style applies until a
  sequence changes it, across line breaks.
- Every other control sequence, operating system command and escape is dropped. An extended colour
  renders in the default ink, and the output ignores a background colour.
- A bright colour renders as its plain twin. Bold renders semibold, and dim renders in `fg.subtle`
  on a run without a colour.
- The output renders as text, never as markup.
- `CodeBlock.Copy` copies the output without its escapes.
- `CodeBlock.parseAnsi(text)` returns the runs, each with `text`, `color`, `bold`, `dim` and
  `underline`. `CodeBlock.stripAnsi(text)` returns the text without escapes.

| Colour  | Ink             |
| ------- | --------------- |
| black   | `fg.subtle`     |
| red     | `code.deleted`  |
| green   | `code.inserted` |
| yellow  | `code.function` |
| blue    | `fg.info`       |
| magenta | `code.keyword`  |
| cyan    | `code.attr`     |
| white   | `fg`            |

### Diff

`before` on the root is the earlier version of the code. `CodeBlock.Diff` renders the lines from it
to the code, and `CodeBlock.DiffStat` counts them.

```tsx
<CodeBlock.Root before={previous} code={next} language="ts">
  <CodeBlock.Header>
    <CodeBlock.Title>src/retry.ts</CodeBlock.Title>
    <CodeBlock.DiffStat />
  </CodeBlock.Header>
  <CodeBlock.Diff mode="split" />
</CodeBlock.Root>
```

- `mode` is `unified`, the default, with both versions' line numbers in one column of lines, or
  `split`, with the earlier version beside the later one and one row per pair. A side without a line
  takes the subtle fill.
- A run of removed lines followed by as many added lines pairs them. A pair that shares at least
  0.35 of the longer line marks the words that changed, in `ins` on the added line and `del` on the
  removed one, with the syntax inks kept. A pair that shares less changes as a whole.
  `wordLevel={false}` turns the marks off.
- A line that differs only in the line break at the end of a version is unchanged.
- Unchanged lines more than `context` lines from a change, 3 by default, fold into a button named
  "Show 12 unchanged lines". A press shows the lines and moves focus to the first of them.
  `Infinity` shows every line.
- A changed line shows a `+` or `−` that a screen reader skips, and states "Added" or "Removed" in
  visually hidden words. Line numbers are `aria-hidden`. The numbers, the marks and the words take
  no selection, so a copied diff contains only code.
- Where both versions are the same, or the root has no `before`, the diff renders `emptyLabel`.
- The region is named by `CodeBlock.Title` while one renders, and otherwise by `label`, which
  defaults to "Changes".
- `CodeBlock.DiffStat` renders the counts in the success and error inks and states them to a screen
  reader through `statLabel`, "3 lines added, 1 line removed" by default.

The words are props with English defaults: `addedLabel`, `removedLabel`, `expandLabel(count)` and
`emptyLabel` on `CodeBlock.Diff`, and `statLabel(counts)` on `CodeBlock.DiffStat`.

## Markdown

Renders a Markdown document with the library's own components. The document never renders a string
of HTML.

```tsx
import { Markdown } from "@stealthscale/component-content";
import { SquareCheckBigIcon, SquareIcon } from "lucide-react";

<Markdown
  glyphs={{ tasks: { done: <SquareCheckBigIcon />, open: <SquareIcon /> } }}
  headingLevel={2}
  source={policy}
/>;
```

| Node                            | Renders                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| Heading                         | typography `Heading`, at the level `headingLevel` sets               |
| Paragraph                       | typography `Text`, with `Strong`, `Em`, `Code` and a `del` inside it |
| Link                            | navigation `Link`, inline in the text                                |
| List, task list                 | typography `List`, with the task's glyph or the recipe's box         |
| Table                           | collections `Table` in a `Table.Scroller` named by its section       |
| Fenced block                    | `CodeBlock` with its title and a copy control                        |
| Quotation                       | typography `Blockquote`                                              |
| Callout, `> [!NOTE]` and others | feedback `Alert` in the kind's palette, `live="off"`                 |
| Thematic break                  | layout `Divider`                                                     |
| Footnotes                       | a `section` named by a visually hidden heading, with back links      |
| Image                           | an `img`, its alt text where the source is empty                     |

| Axis   | Values     | Default |
| ------ | ---------- | ------- |
| `size` | `sm`, `md` | `md`    |

`size` sets the body text style and the gaps: `sm` for a comment or a chat message, `md` for a page.
The root's width is at most the theme's `prose` measure, 65ch unless a theme states another.

- `source` takes Markdown text or a document parsed ahead with `parseMarkdown`.
- Raw HTML renders as text, because the parser runs without `allowHtml`. The parser returns an empty
  source for a `javascript:` or `data:` image and keeps only the words of a `javascript:` link.
  `urlTransform` applies the caller's own URL policy.
- `headingLevel` sets the level of `#`, 1 by default. A heading renders `headingLevel` minus 1
  levels below its depth, no deeper than 6, and takes the size of the level it renders at.
- `streaming` closes a fence the text has not closed yet, so a streamed answer shows its code as
  code while it arrives. While `streaming`, the root is `aria-busy`, so a screen reader in a live
  region around it reads the finished document once. The recipe renders a caret after the last
  block: an empty box in the text's ink that pulses at the theme's ambient pace, `CanvasText` under
  forced colors, with no text for a screen reader to read.
- `components` replaces the component for `link`, `image` or `code` with the caller's, such as a
  router's link.
- `glyphs` takes the callouts' glyphs by kind, the copy control's `idle` and `copied` glyphs, and
  the tasks' `done` and `open` glyphs.
- A task item states "Completed task" or "Incomplete task" in visually hidden words before its text.
- A footnote reference is a `sup` link described by the footnotes' heading, and each footnote ends
  with one back link per reference to it. The IDs take a prefix per document, so two documents on a
  page share none.

The words are props with English defaults: `calloutLabel(kind)`, `codeLabel(language)`, `copyLabel`,
`copiedLabel`, `footnoteBackLabel(number, reference)`, `footnotesLabel`, `tableLabel`,
`taskDoneLabel` and `taskOpenLabel`.

## JsonTreeView

Renders a JSON value as a tree: a row per key and value, each kind of value in its ink from the
theme's `code` family. Each collapsed branch previews its first entries, and each open branch ends
with its closing brace on a row of its own. The tree is the collections package's `TreeView`, so it
takes the tree's keys, focus and selection.

```tsx
import { JsonTreeView } from "@stealthscale/component-content";
import { ChevronRightIcon } from "lucide-react";

<JsonTreeView.Root data={payout} defaultExpandedDepth={2}>
  <JsonTreeView.Tree aria-label="Payout response" arrow={<ChevronRightIcon />} indentGuide />
</JsonTreeView.Root>;
```

| Part   | Element | What it renders                                                                    |
| ------ | ------- | ---------------------------------------------------------------------------------- |
| `Root` | `div`   | The tree view's root over the value, with the opening depth and preview options    |
| `Tree` | `div`   | The tree, a row per node: a branch for a value with properties, an item for a leaf |

| Axis   | Values     | Default |
| ------ | ---------- | ------- |
| `size` | `sm`, `md` | `sm`    |

`size` sets the code text style and passes on to the tree view, whose rows measure 24 and 32px.

`JsonTreeView.Root` takes these props:

- `data`: the value, of any type.
- `defaultExpandedDepth`: the deepest level open on the first render, counted from the value's own
  row at level 1. The default opens that row alone, which lists the value's keys. A depth of 0 opens
  nothing.
- `maxPreviewItems`: the entries a collapsed branch lists. 3 by default.
- `groupArraysAfterLength`: the length above which an array splits into branches of that length. 100
  by default.
- `showNonenumerable`: whether a branch lists a function's source and an object's non-enumerable
  properties. `true` by default.
- `quotesOnKeys`: whether each key is written in quotes. `false` by default.
- Every `TreeView.Root` prop except `collection` and `selected`, such as `onSelectionChange` and
  `expandedValue`.

`JsonTreeView.Tree` takes these props:

- `aria-label` or `aria-labelledby`: the tree's name.
- `arrow`: the glyph of a branch's indicator.
- `indentGuide`: whether each open group renders a line under its branch's indicator.
- `getHref(node)`: an address for a leaf. The row renders as a link to it.
- `renderValue(node)`: what a leaf renders in place of its value, in the value's ink. `undefined`
  renders the value.

`JsonTreeView.JsonNode` types the node both functions receive: its `value`, its `type` and its
`keyPath`.

A row is named by its text, the key and the value's preview. The tree view's selected look is
`plain`: on the subtle fill the code inks measure 5.7:1 after dark, under the theme's 7:1 text
ratio.

Not offered:

- `collapseStringsAfterLength`: `@zag-js/json-tree-utils` 1.44.0 describes an object's entries
  without the preview options, so the option does not change a preview.
- A description per row from `getAccessibleDescription`: as the row's `aria-label`, it leaves a
  collapsed branch's preview out of the row's name, against WCAG 2.5.3.
- A link rendered inside a row: use `getHref`, which keeps one tab stop for the tree.

## Marquee

Moves a strip of items across or down in a loop at a speed in pixels per second, and fades the strip
at its ends. A pause control stops it until the reader plays it again.

```tsx
import { Marquee } from "@stealthscale/component-content";
import { PauseIcon, PlayIcon } from "lucide-react";

<Marquee.Root aria-label="Customers" autoFill pauseOnInteraction speed={40}>
  <Marquee.Viewport>
    <Marquee.Content>
      {customers.map((customer) => (
        <Marquee.Item key={customer.id}>{customer.name}</Marquee.Item>
      ))}
    </Marquee.Content>
  </Marquee.Viewport>
  <Marquee.Edge side="start" />
  <Marquee.Edge side="end" />
  <Marquee.PauseTrigger>
    <Marquee.PauseIndicator pause={<PauseIcon />} play={<PlayIcon />} />
  </Marquee.PauseTrigger>
</Marquee.Root>;
```

| Axis  | Values                       | Default |
| ----- | ---------------------------- | ------- |
| `gap` | `xs`, `sm`, `md`, `lg`, `xl` | `md`    |

`gap` sets the space between two items from the theme's gap scale, and the same space across the
join of two copies.

- The root takes the machine's options: `speed` in pixels per second, 50 by default, `side`, `dir`,
  `reverse`, `delay` in seconds before the first loop, `loopCount`, `onLoopComplete`, `onComplete`,
  `autoFill`, `id` and `ids`. `side` is the end the strip moves towards: `start`, the default, or
  `end` across, and `top` or `bottom` down. `start` and `end` follow `dir`.
- A copy moves its own length in its length divided by `speed`, so the strip moves at `speed` for
  any number of copies.
- `Marquee.Content` renders the items once and a copy after them. Under `autoFill` it renders as
  many copies as fill the root, and counts again whenever the root or the first copy resizes. Every
  copy after the first is `aria-hidden` and `inert`, so a screen reader reads the items once and Tab
  moves to each control once.
- `loopCount` of 0, the default, loops without end. `onLoopComplete` runs after each loop and
  `onComplete` after the last.
- The root is a `region` with `aria-live="off"`. The type requires its name as `aria-label` or
  `aria-labelledby`.
- `Marquee.PauseTrigger` pauses the strip until the next press. Its name states the action a press
  takes: `pauseLabel`, "Pause" by default, while the strip moves by the reader's choice, and
  `playLabel`, "Play" by default, while the reader has paused it. It renders the actions `Button` as
  a `surface` `xs` square over the strip's end. A handler that calls `preventDefault` in `onClick`
  keeps the choice. `Marquee.PauseIndicator` renders the `pause` or the `play` glyph by the same
  choice.
- `paused` or `defaultPaused` with `onPauseChange` set the reader's choice. `onPauseChange` receives
  `{ paused }`.
- Under `pauseOnInteraction`, a pointer over the strip or focus inside it pauses the strip while it
  is there, and the reader's choice does not change. A strip the reader paused remains paused after
  the pointer leaves.
- WCAG 2.2.2 requires a pause for a strip that moves by itself for more than five seconds. Render
  `Marquee.PauseTrigger`, or a control of the application's own that sets `paused`.
- `Marquee.Edge` renders no content. Its `side` makes the viewport fade that end from transparent to
  opaque over a fifth of the root's length, so the strip fades into any background.
- Under reduced motion the copies rest and the pause control is hidden.

| Part                     | Element                         |
| ------------------------ | ------------------------------- |
| `Marquee.Root`           | `div`, role `region`            |
| `Marquee.Viewport`       | `div`                           |
| `Marquee.Content`        | a `div` per copy                |
| `Marquee.Item`           | `div`                           |
| `Marquee.Edge`           | `div`                           |
| `Marquee.PauseTrigger`   | `button`                        |
| `Marquee.PauseIndicator` | the `pause` or the `play` glyph |

The marquee does not offer these:

- `spacing`. The `gap` axis sets the space between items.
- `translations`. The root takes `aria-label` or `aria-labelledby`, and the pause control takes
  `pauseLabel` and `playLabel`.
- The machine's `aria-roledescription`, an English word a screen reader announces in place of the
  role.
- The machine's api. A caller controls `paused`.
