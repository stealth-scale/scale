# @stealthscale/component-data

Draws one value for reading: a figure, an instant, a label, a state. Every component binds a recipe
and draws nothing of its own, so a theme restyles all of them by extending the recipe. The preset
under `./theme` registers the recipes with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-data
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Badge

Labels something with one short word or a count, set off from what it labels. Its look is flat, so
it does not repaint under a pointer. Put a badge inside a row that hovers and the pointer crosses
the badge whenever it crosses the row, and a badge that changed under the pointer would read as a
control a reader can press and then cannot. Numbers are tabular, so a column of counts holds its
width as the counts change.

A badge is read beside a control of its own size and drawn at half its height. Its inset, its gap
and its label all come from the smaller step of the scale, so a medium badge beside a medium button
reads at the small label rather than the medium one.

```tsx
import { Badge, BadgePropsProvider } from "@stealthscale/component-data";

<Badge>New</Badge>;
<Badge radius="full" status="error">
  3
</Badge>;
<Badge as="output" variant="outline">
  Draft
</Badge>;
<BadgePropsProvider value={{ size: "sm", variant: "surface" }}>
  <Badge>Public</Badge>
  <Badge status="success">Live</Badge>
</BadgePropsProvider>;
```

`BadgePropsProvider` sets the variants of every badge below it. A prop on the badge itself overrides
the provider's.

The element is `span` and has no role, so a screen reader reads its text and nothing else. A badge
whose meaning is in its colour needs that meaning in words: a red badge reading `3` tells a sighted
reader that three things failed and tells a screen reader `3`. Write the words with `aria-label`, or
put them in the badge and let the colour repeat them.

| Axis      | Values                                            | Default  |
| --------- | ------------------------------------------------- | -------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain`  | `subtle` |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`     |
| `status`  | `info`, `success`, `warning`, `error`, `neutral`  | primary  |
| `radius`  | `l1`, `l2`, `l3`, `full`                          | `l2`     |

There is no ghost look here. A ghost control is a transparent box that fills in under a pointer, and
a look that never repaints leaves it identical to plain.

## Status

Reports what something is doing now with a colored dot and a word.

```tsx
import { Status } from "@stealthscale/component-data";

<Status.Root palette="success">
  <Status.Indicator />
  Live
</Status.Root>;
<Status.Root effect="pulse" palette="success" size="inherit">
  <Status.Indicator />
  live
</Status.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `neutral` |
| `size`    | `sm`, `md`, `lg`, `inherit`                                        | `md`      |
| `effect`  | `glow`, `pulse`                                                    | none      |

| Part        | Element | What it renders                         |
| ----------- | ------- | --------------------------------------- |
| `Root`      | `span`  | The dot and the word, on one line       |
| `Indicator` | `span`  | The dot, hidden from assistive software |

The word carries the meaning, so the status is readable without the color and a screen reader
announces the word alone. `palette` offers all eight semantic palettes, because a caller maps its
own states to them.

The root is a `span`, so a status is valid inside a paragraph, a table cell or a button. `inherit`
takes the font of the surrounding text, and the word is aligned on its baseline. The dot and the gap
are sized in `em`, so they follow the text at every size.

`pulse` animates a halo around the dot, the usual signal for a live connection, and stops when the
reader prefers reduced motion. The dot keeps its color in forced colors mode.

## Stat

Presents a figure with the label that names it and a line of help text, such as a change or a
comparison.

```tsx
import { Stat } from "@stealthscale/component-data";

<Stat.Root palette="success">
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText>£48,200</Stat.ValueText>
  <Stat.HelpText>
    <Stat.Indicator>
      <ArrowUpIcon aria-hidden />
    </Stat.Indicator>
    +12% from last month
  </Stat.HelpText>
</Stat.Root>;
<Stat.Root size="sm">
  <Stat.Label>Time to settle</Stat.Label>
  <Stat.ValueText>
    3<Stat.ValueUnit>hr</Stat.ValueUnit>
  </Stat.ValueText>
</Stat.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `neutral` |

| Part        | Element | What it renders                              |
| ----------- | ------- | -------------------------------------------- |
| `Root`      | `dl`    | The stat, as a description list              |
| `Label`     | `dt`    | The name of the figure                       |
| `ValueText` | `dd`    | The figure                                   |
| `ValueUnit` | `span`  | A unit after a number in the figure          |
| `HelpText`  | `dd`    | A change or a comparison under the figure    |
| `Indicator` | `span`  | The glyph that shows the direction of change |

`size` sets the figure's heading text style: 22.8px, 27.2px and 32.4px at the foundation's metrics.
The label and the help text keep their size. The figure uses tabular numerals, so a value that
updates in place keeps its width. The component formats nothing, so any number formatter can render
the figure.

`palette` colors the indicator only. The direction of a change and whether it is good are separate
facts, so the caller chooses both. A rise in revenue takes `success`, and a rise in open tickets
takes `error`. Pass the glyph with `aria-hidden` and write the direction in the help text with a
sign, such as `+12%`, which a screen reader announces.

The help text is a `dd`, because a description list may contain only terms and details as its direct
children.

## Licence

MIT. See [LICENSE](LICENSE).
