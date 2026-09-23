# @stealthscale/component-typography

Text components: a paragraph, a heading, inline code, keycaps, runs of stressed, important,
highlighted and quoted text, an icon, a list and a block quotation. Each component binds a recipe,
and a theme restyles it by extending the recipe. Every value a theme can change is an axis of the
recipe, so a caller sets it as a prop. `as` changes the element. A component with parts is a
namespace, such as `Kbd.Root` and `List.Item`.

## Install

```bash
pnpm add @stealthscale/component-typography
```

The package peers on `react` and `@stealthscale/theme`. Add the preset under `./theme` to the
presets of the application's compiler.

## Text

`Text` renders a paragraph in a `p` element. Set `as="span"` for text inside a line.

```tsx
import { Text } from "@stealthscale/component-typography";

<Text size="lg" tone="muted" weight="medium">
  Your session ends in five minutes.
</Text>;
<Text align="center" truncate>
  Payouts settle within two business days in 34 countries.
</Text>;
```

`truncate` hides the end of the text and `mask` fades part of it. Show the full text elsewhere, such
as in a detail view. Set the `inverted` ink only on a `bg.inverted` surface. It fails the text
contrast ratio on the page.

| Axis       | Values                                                                          | Default   |
| ---------- | ------------------------------------------------------------------------------- | --------- |
| `size`     | `xs`, `sm`, `md`, `lg`, `xl`                                                    | `md`      |
| `tone`     | `default`, `muted`, `subtle`, `inverted`, `info`, `success`, `warning`, `error` | inherited |
| `weight`   | `normal`, `medium`, `semibold`, `bold`                                          | inherited |
| `align`    | `start`, `center`, `end`, `justify`                                             | inherited |
| `truncate` | `true`                                                                          | off       |
| `motion`   | `fade`, `rise`, `reveal`                                                        | none      |
| `mask`     | `bottom`, `edges`, `radial`                                                     | none      |

## Heading

`Heading` renders a heading in an `h2` element. `as` sets another level. `size` sets the prominence
and is independent of the level.

```tsx
import { Heading } from "@stealthscale/component-typography";

<Heading as="h1" display size="4xl">
  Welcome back, Ada
</Heading>;
<Heading as="h3" size="md" tone="muted">
  Account settings
</Heading>;
```

`display` sets the display text role: its `sm` step at `2xl`, its `lg` step at `4xl` and its `md`
step at every other size. `Text` and `Heading` set `overflow-wrap: anywhere`, so a word wider than
its container breaks.

| Axis       | Values                                                                          | Default   |
| ---------- | ------------------------------------------------------------------------------- | --------- |
| `size`     | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                               | `lg`      |
| `display`  | `true`                                                                          | off       |
| `tone`     | `default`, `muted`, `subtle`, `inverted`, `info`, `success`, `warning`, `error` | inherited |
| `effect`   | `gradient`, `shine`                                                             | none      |
| `motion`   | `fade`, `rise`, `reveal`                                                        | none      |
| `truncate` | `true`                                                                          | off       |

## Code

`Code` renders code inside a line of text in a `code` element. A block of code with lines, a title
and a copy control is `CodeBlock` in `@stealthscale/component-content`.

```tsx
import { Code, Text } from "@stealthscale/component-typography";

<Text>
  Run <Code>pnpm add @stealthscale/theme</Code> in the application's directory.
</Text>;
<Code palette="error" variant="solid">
  ENOENT
</Code>;
```

| Axis      | Values                                                                             | Default   |
| --------- | ---------------------------------------------------------------------------------- | --------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain`                                   | `subtle`  |
| `size`    | `sm`, `md`                                                                         | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | `neutral` |

## Em

`Em` marks stressed text in an `em` element, which has the `emphasis` role. The recipe sets the
italic face.

```tsx
import { Em, Text } from "@stealthscale/component-typography";

<Text>
  The export starts <Em>after</Em> the backup finishes.
</Text>;
<Em as="i">Stealth Scale</Em>;
```

Set `as="i"` for italic text with no stress, such as a product name or a term. An `i` element has no
role.

| Axis     | Values                                                                          | Default   |
| -------- | ------------------------------------------------------------------------------- | --------- |
| `tone`   | `default`, `muted`, `subtle`, `inverted`, `info`, `success`, `warning`, `error` | inherited |
| `motion` | `fade`, `rise`, `reveal`                                                        | none      |

## Strong

`Strong` marks text as more important than the surrounding text, in a `strong` element, which has
the `strong` role. The `weight` axis has no `normal` value.

```tsx
import { Strong, Text } from "@stealthscale/component-typography";

<Text>
  Deleting a workspace <Strong tone="error">cannot be undone.</Strong>
</Text>;
```

Set `as="b"` for bold text with no importance, such as a keyword in a definition. A `b` element has
no role.

| Axis     | Values                                                                          | Default    |
| -------- | ------------------------------------------------------------------------------- | ---------- |
| `weight` | `medium`, `semibold`, `bold`                                                    | `semibold` |
| `tone`   | `default`, `muted`, `subtle`, `inverted`, `info`, `success`, `warning`, `error` | inherited  |
| `motion` | `fade`, `rise`, `reveal`                                                        | none       |

## Mark

`Mark` highlights text inside a line, such as a search hit, in a `mark` element, which has the
`mark` role. `MarkPropsProvider` sets the variants of every mark below it.

```tsx
import { Mark, MarkPropsProvider, Text } from "@stealthscale/component-typography";

<Text>
  Found <Mark>chassis</Mark> in 3 files.
</Text>;
<MarkPropsProvider value={{ palette: "warning", variant: "solid" }}>
  <SearchResults />
</MarkPropsProvider>;
```

A highlight that conveys meaning needs a second cue. The `text` look sets a heavier weight, and a
`VisuallyHidden` beside the run states the meaning to a screen reader. Most screen readers announce
a `mark` only when the user enables it, and WCAG 1.4.1 fails a distinction made by colour alone.

| Axis      | Values                                                                             | Default   |
| --------- | ---------------------------------------------------------------------------------- | --------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain`, `text`                           | `subtle`  |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | inherited |
| `radius`  | `l1`, `l2`, `l3`, `full`                                                           | `l1`      |
| `inset`   | `xs`, `sm`, `md`. The `plain` and `text` looks set no inset                        | `xs`      |
| `motion`  | `fade`, `rise`, `reveal`                                                           | none      |
| `effect`  | `glow`, `shine`                                                                    | none      |

## Quote

`Quote` renders a quotation inside a line of text in a `q` element. The browser adds the quotation
marks of the language in `lang`, so the text contains no marks. `cite` takes the address of the
source.

```tsx
import { Quote, Text } from "@stealthscale/component-typography";

<Text>
  The auditor called the report{" "}
  <Quote cite="https://example.org/audit">complete and accurate</Quote>.
</Text>;
```

Set `marks="none"` for text that contains its own punctuation, such as a quotation inside another. A
quotation set as its own block is `Blockquote.Root`.

| Axis     | Values                                                                          | Default   |
| -------- | ------------------------------------------------------------------------------- | --------- |
| `marks`  | `auto`, `none`                                                                  | `auto`    |
| `tone`   | `default`, `muted`, `subtle`, `inverted`, `info`, `success`, `warning`, `error` | inherited |
| `motion` | `fade`, `rise`, `reveal`                                                        | none      |

## Span

`Span` renders text inside a line in a `span` element, which has no semantics. The recipe has no
`size` axis, so a span inherits the font of its line. `Text` with `as="span"` sets the `md` body
size, which resets the size inside a heading.

```tsx
import { Span, Text } from "@stealthscale/component-typography";

<Text>
  Due <Span weight="semibold">€1,024.00</Span>
</Text>;
<Span truncate>/var/log/nginx/access.log.2026-09-19.gz</Span>;
```

Use the element with semantics where one applies: `Em` for stress, `Strong` for importance, `Mark`
for a highlight and `Quote` for a quotation.

| Axis       | Values                                                                          | Default   |
| ---------- | ------------------------------------------------------------------------------- | --------- |
| `tone`     | `default`, `muted`, `subtle`, `inverted`, `info`, `success`, `warning`, `error` | inherited |
| `weight`   | `normal`, `medium`, `semibold`, `bold`                                          | inherited |
| `truncate` | `true`                                                                          | off       |
| `motion`   | `fade`, `rise`, `reveal`                                                        | none      |

## Kbd

`Kbd.Root` renders one keycap in a `kbd` element. `Kbd.Group` renders a key combination: a `kbd`
around one `kbd` per key, which is the HTML markup for a combination. The group sets its `size`,
`variant` and `palette` on every keycap inside it, and a value set on a keycap takes precedence.

```tsx
import { Kbd, Text } from "@stealthscale/component-typography";

<Text>
  Press{" "}
  <Kbd.Group>
    <Kbd.Root>⌘</Kbd.Root>
    <Kbd.Root>K</Kbd.Root>
  </Kbd.Group>{" "}
  to search.
</Text>;
<Kbd.Root variant="outline">Esc</Kbd.Root>;
```

A keycap is 19.2, 21.6 or 24px tall at `sm`, `md` and `lg`, so it fits a 24px line of body text. A
one-character key is square. The keycap uses the body face, which renders `⌘`, `⇧` and `⌥` at the
height of the letters.

| Axis      | Values                                                                             | Default   |
| --------- | ---------------------------------------------------------------------------------- | --------- |
| `variant` | `raised`, `outline`, `subtle`, `plain`                                             | `raised`  |
| `size`    | `sm`, `md`, `lg`                                                                   | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | `neutral` |

## Icon

`Icon` renders an icon in an `svg` element with the `img` role. Pass the artwork as paths in the
children, or pass an icon component through `as`. The icon is hidden from assistive technology by
default. For an icon without text beside it, set `aria-hidden={false}` and `aria-label`.

```tsx
import { StarIcon } from "lucide-react";

import { Icon } from "@stealthscale/component-typography";

<Icon aria-hidden={false} aria-label="Favourite" as={StarIcon} size="lg" tone="warning" />;
<Icon viewBox="0 0 24 24">
  <path d="M12 2 2 22h20Z" />
</Icon>;
```

An `svg` without a `fill` attribute fills with the current colour. An icon that sets `fill`, such as
a lucide icon with `fill="none"`, keeps it. Set `mirrored` on an icon that points, such as an arrow.
The icon then flips in a right-to-left page.

| Axis       | Values                                                                                     | Default   |
| ---------- | ------------------------------------------------------------------------------------------ | --------- |
| `size`     | `inherit`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                               | `inherit` |
| `tone`     | `current`, `default`, `muted`, `subtle`, `inverted`, `info`, `success`, `warning`, `error` | `current` |
| `motion`   | `spin`, `float`, `twinkle`                                                                 | none      |
| `mirrored` | `true`                                                                                     | off       |

## List

`List.Root` renders a `ul` element with `List.Item` entries. Set `as="ol"` for a numbered list. The
`plain` look removes the browser's markers, and each item renders its mark in a `List.Indicator`.
The indicator is one line tall and centres its content. Assistive technology skips it, as it skips
the browser's marker. Put the meaning of a mark, such as a done state, in the item's text.

```tsx
import { CheckIcon } from "lucide-react";

import { Icon, List } from "@stealthscale/component-typography";

<List.Root as="ol" gap="sm">
  <List.Item>Verify your email address</List.Item>
  <List.Item>Connect a bank account</List.Item>
</List.Root>;
<List.Root variant="plain">
  <List.Item>
    <List.Indicator>
      <Icon as={CheckIcon} tone="success" />
    </List.Indicator>
    Unlimited invoices
  </List.Item>
</List.Root>;
```

| Axis      | Values                                                                                                                                   | Default       | Styles                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------- |
| `variant` | `marker`, `plain`                                                                                                                        | `marker`      | the root and the item |
| `gap`     | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                                                                                        | `md`          | the root              |
| `align`   | `start`, `center`, `end`                                                                                                                 | `start`       | the item              |
| `marker`  | `disc`, `circle`, `square`, `dash`, `decimal`, `leading-zero`, `lower-roman`, `upper-roman`, `lower-alpha`, `upper-alpha`, `lower-greek` | the element's | the item              |
| `motion`  | `rise`, `reveal`                                                                                                                         | none          | the item              |

## Blockquote

A block quotation is a `Blockquote.Root` `figure` that contains `Blockquote.Icon`,
`Blockquote.Content` (a `blockquote`) and `Blockquote.Caption` (a `figcaption`).

```tsx
import { Blockquote } from "@stealthscale/component-typography";

<Blockquote.Root palette="accent" variant="surface">
  <Blockquote.Icon />
  <Blockquote.Content>
    Moving billing to one ledger cut our month-end close from nine days to two.
  </Blockquote.Content>
  <Blockquote.Caption>Priya Raman, Head of Finance at Northwind</Blockquote.Caption>
</Blockquote.Root>;
```

- `Blockquote.Icon` renders the library's quote mark when it has no children. Children replace the
  mark, such as a lucide icon with `viewBox="0 0 24 24"` on the part.
- The icon is one line of the quotation tall at every size. At `justify="start"` it hangs in a start
  gutter beside the quotation and the caption. At `center` and `end` the icon is above the
  quotation.
- The quotation is upright. Use `Em` for stress inside it.

| Axis      | Values                                                                             | Default   | Styles                |
| --------- | ---------------------------------------------------------------------------------- | --------- | --------------------- |
| `variant` | `subtle`, `solid`, `surface`, `plain`, `glass`                                     | `subtle`  | the root and the icon |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | `neutral` | the root              |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                                                       | `md`      | the root              |
| `justify` | `start`, `center`, `end`                                                           | `start`   | the root and the icon |
| `motion`  | `rise`, `reveal`                                                                   | none      | the root              |

## Types

| Type                      | Props of                                                           |
| ------------------------- | ------------------------------------------------------------------ |
| `TextProps`               | `Text`: the recipe's variants and a `p` element's props            |
| `HeadingProps`            | `Heading`: the recipe's variants and an `h2` element's props       |
| `CodeProps`               | `Code`: the recipe's variants and a `code` element's props         |
| `EmProps`                 | `Em`: the recipe's variants and an `em` element's props            |
| `StrongProps`             | `Strong`: the recipe's variants and a `strong` element's props     |
| `MarkProps`               | `Mark`: the recipe's variants and a `mark` element's props         |
| `QuoteProps`              | `Quote`: the recipe's variants and a `q` element's props           |
| `SpanProps`               | `Span`: the recipe's variants and a `span` element's props         |
| `Kbd.RootProps`           | `Kbd.Root`: the recipe's variants and a `kbd` element's props      |
| `Kbd.GroupProps`          | `Kbd.Group`: `size`, `variant`, `palette` and a `kbd`'s props      |
| `IconProps`               | `Icon`: the recipe's variants and an `svg` element's props         |
| `List.RootProps`          | `List.Root`: the recipe's variants and a `ul` element's props      |
| `List.ItemProps`          | `List.Item`: an `li` element's props                               |
| `List.IndicatorProps`     | `List.Indicator`: a `span` element's props                         |
| `Blockquote.RootProps`    | `Blockquote.Root`: the recipe's variants and a `figure`'s props    |
| `Blockquote.IconProps`    | `Blockquote.Icon`: the icon recipe's variants and an `svg`'s props |
| `Blockquote.ContentProps` | `Blockquote.Content`: a `blockquote` element's props               |
| `Blockquote.CaptionProps` | `Blockquote.Caption`: a `figcaption` element's props               |

## Licence

MIT. See [LICENSE](LICENSE).
