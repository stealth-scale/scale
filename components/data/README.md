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

## Licence

MIT. See [LICENSE](LICENSE).
