# @stealthscale/component-layout

Layout components: a stack, a group of controls, a grid, a width container, a picture frame, a
divider and a spacer. Each component binds a recipe, and a theme restyles it by extending the
recipe. Every value a theme can change is an axis of the recipe, so a caller sets it as a prop. `as`
changes the element. The grid is a namespace: `Grid.Root` and `Grid.Item`.

The components respond to the width of their container, not of the window.

## Install

```bash
pnpm add @stealthscale/component-layout
```

The package peers on `react` and `@stealthscale/theme`. Add the preset under `./theme` to the
presets of the application's compiler.

## Stack

`Stack` lays out its children in one direction with a gap token between them. It renders a `div`.
Set `as="ul"` for a list, so a screen reader counts the items.

```tsx
import { Stack } from "@stealthscale/component-layout";

<Stack gap="lg">
  <h2>Payouts</h2>
  <p>Payouts reach your bank account two business days after a charge settles.</p>
</Stack>;
<Stack direction="row" justify="between" wrap>
  <span>Invoice INV-2041</span>
  <button type="button">Pay</button>
</Stack>;
```

A row centres its children on the cross axis, and a column stretches them. A stated `align`
overrides both. `justify` and `align` cannot share a value, because the class name contains the
value and not the axis, so `align` offers the CSS spellings `flex-start` and `flex-end`.

| Axis        | Values                                                  | Default |
| ----------- | ------------------------------------------------------- | ------- |
| `direction` | `column`, `column-reverse`, `row`, `row-reverse`        | column  |
| `gap`       | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`       | `md`    |
| `justify`   | `start`, `center`, `end`, `between`, `around`, `evenly` | start   |
| `align`     | `flex-start`, `flex-end`, `stretch`, `baseline`         | by row  |
| `wrap`      | `true`                                                  | off     |

## Group

`Group` lays out controls in one direction, a gap token apart or attached into one control. It
renders a `div`. Set `as="fieldset"` and an `aria-label` when the children are one set of choices.

```tsx
import { Button } from "@stealthscale/component-actions";
import { Group } from "@stealthscale/component-layout";

<Group aria-label="Period" as="fieldset" attached>
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="outline">Month</Button>
</Group>;
<Group grow>
  <Button variant="outline">Save</Button>
  <Button variant="subtle">Discard</Button>
</Group>;
```

`attached` squares the corners between neighbours and overlaps their borders by the control border
width, so each shared border renders once. An attached group does not wrap and ignores `gap`. `grow`
and `justify` make the group as wide as its container. `dim` blurs and fades every child except a
hovered, keyboard-focused or `aria-pressed="true"` one.

| Axis          | Values                                                  | Default      |
| ------------- | ------------------------------------------------------- | ------------ |
| `orientation` | `horizontal`, `vertical`                                | `horizontal` |
| `gap`         | `xs`, `sm`, `md`, `lg`, `xl`                            | `sm`         |
| `attached`    | `true`                                                  | off          |
| `grow`        | `true`                                                  | off          |
| `dim`         | `true`                                                  | off          |
| `justify`     | `start`, `center`, `end`, `between`, `around`, `evenly` | none         |
| `align`       | `flex-start`, `flex-end`, `stretch`, `baseline`         | stretch      |

## Grid

`Grid.Root` lays out its children in columns. `Grid.Item` sets how many columns a child spans. A
child that spans one column needs no `Grid.Item`.

```tsx
import { Grid } from "@stealthscale/component-layout";

<Grid.Root columns="fit-xs" gap="lg">
  <PlanCard plan="starter" />
  <PlanCard plan="growth" />
  <PlanCard plan="scale" />
</Grid.Root>;
<Grid.Root columns="12">
  <Grid.Item span="8">
    <Article />
  </Grid.Item>
  <Grid.Item span="4">
    <Aside />
  </Grid.Item>
</Grid.Root>;
```

A count renders that many equal columns, each at least 0 wide, so a long word in one child cannot
widen a column. `fit-<width>` renders as many columns of the width token as the container fits and
stretches them over the row. `fill-<width>` renders the same columns and keeps the empty tracks, so
a lone child keeps the column width. `justify` sets `justify-items`, because every template already
fills the row. `dense` fills the hole an earlier spanning child left with a later child.

| Axis      | Values                                                          | Default | Styles   |
| --------- | --------------------------------------------------------------- | ------- | -------- |
| `columns` | `1` to `12`, `fit-xs` to `fit-8xl`, and `fill-xs` to `fill-8xl` | `1`     | the root |
| `gap`     | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`               | `md`    | the root |
| `justify` | `start`, `center`, `end`                                        | stretch | the root |
| `align`   | `flex-start`, `flex-end`, `stretch`, `baseline`                 | stretch | the root |
| `flow`    | `row`, `dense`                                                  | row     | the root |
| `span`    | `1` to `12`, and `full`                                         | one     | the item |

## Container

`Container` limits its content to a maximum inline size, centres it in its parent and pads each side
with the `lg` inset. It renders a `div`. Set `as="main"` on the container of a page's main content.

```tsx
import { Container } from "@stealthscale/component-layout";

<Container as="main" size="6xl">
  <Dashboard />
</Container>;
<Container flush size="prose">
  <p>Payouts reach your bank account two business days after a charge settles.</p>
</Container>;
```

`prose` is `60ch`, so it follows the theme's body face. `flush` removes the gutter.

| Axis    | Values                         | Default |
| ------- | ------------------------------ | ------- |
| `size`  | `xs` to `8xl`, `full`, `prose` | `3xl`   |
| `flush` | `true`                         | off     |

## Frame

`Frame` clips a picture, a video or a map to an aspect ratio and a corner radius. It renders a `div`
and sizes its child to 100% in both directions, so the aspect ratio sets the frame's height from its
width. The frame has no accessible name, so put the alternative text on the child picture.

```tsx
import { Frame } from "@stealthscale/component-layout";

<Frame radius="l2" ratio="video">
  <img alt="Green hills with pine trees under a yellow sun" src={hillside} />
</Frame>;
<Frame radius="full">
  <img alt="Ada Lovelace" src={portrait} />
</Frame>;
```

`cover` crops the child to the frame and `contain` shows the whole child. `blur` applies one of the
theme's blur layer styles to the child and scales it by 1.06, 1.09 or 1.12, so the frame clips the
softened edge.

| Axis     | Values                                                                    | Default  |
| -------- | ------------------------------------------------------------------------- | -------- |
| `ratio`  | `square`, `landscape`, `portrait`, `golden`, `video`, `wide`, `ultrawide` | `square` |
| `radius` | `l1`, `l2`, `l3`, `full`                                                  | none     |
| `fit`    | `cover`, `contain`                                                        | `cover`  |
| `blur`   | `sm`, `md`, `lg`                                                          | none     |

## Divider

`Divider` renders a hairline `hr` in the `border` color, which has the `separator` role. It sets
`aria-orientation` from `orientation`, whether the prop or `DividerPropsProvider` sets it. A
vertical divider stretches to the height of its row.

```tsx
import { Divider, Stack } from "@stealthscale/component-layout";

<Divider />;
<Stack direction="row" gap="sm">
  <button type="button">Undo</button>
  <Divider orientation="vertical" />
  <button type="button">Bold</button>
</Stack>;
```

| Axis          | Values                   | Default      |
| ------------- | ------------------------ | ------------ |
| `orientation` | `horizontal`, `vertical` | `horizontal` |

## Spacer

`Spacer` takes the free space along a stack's main axis, which pushes the children after it to the
end. It renders an empty `div` with `aria-hidden`, so a screen reader skips it. The recipe has no
axis.

```tsx
import { Spacer, Stack } from "@stealthscale/component-layout";

<Stack direction="row">
  <h2>Invoices</h2>
  <Spacer />
  <button type="button">New invoice</button>
</Stack>;
```

## Types

| Type             | Props of                                                       |
| ---------------- | -------------------------------------------------------------- |
| `StackProps`     | `Stack`: the recipe's variants and a `div` element's props     |
| `GroupProps`     | `Group`: the recipe's variants and a `div` element's props     |
| `Grid.RootProps` | `Grid.Root`: the recipe's root variants and a `div`'s props    |
| `Grid.ItemProps` | `Grid.Item`: `span` and a `div` element's props                |
| `ContainerProps` | `Container`: the recipe's variants and a `div` element's props |
| `FrameProps`     | `Frame`: the recipe's variants and a `div` element's props     |
| `DividerProps`   | `Divider`: the recipe's variants and an `hr` element's props   |
| `SpacerProps`    | `Spacer`: a `div` element's props                              |

Every component except the grid parts has a props provider that sets its variants on every instance
below it: `StackPropsProvider`, `GroupPropsProvider`, `ContainerPropsProvider`,
`FramePropsProvider`, `DividerPropsProvider` and `SpacerPropsProvider`.

## Licence

MIT. See [LICENSE](LICENSE).
