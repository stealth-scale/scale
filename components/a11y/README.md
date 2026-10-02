# @stealthscale/component-a11y

Components for keyboard and screen reader users: hidden text, a skip link and its target, and a
roving focus group. Each component binds a recipe, and a theme restyles it by extending the recipe.
A component with parts is a namespace, such as `SkipNav.Link` and `RovingFocus.Item`.

## Install

```bash
pnpm add @stealthscale/component-a11y
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`. Add the preset under
`./theme` to the presets of the application's compiler.

## VisuallyHidden

`VisuallyHidden` renders content that a screen reader announces and the browser does not paint. It
renders a `span` clipped to 1px, which keeps the content in the accessibility tree. `display: none`
and `visibility: hidden` remove it from the tree.

```tsx
import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { VisuallyHidden } from "@stealthscale/component-a11y";

<Button shape="square" variant="outline">
  <XIcon aria-hidden size="1em" />
  <VisuallyHidden>Close</VisuallyHidden>
</Button>;
<VisuallyHidden as="h2">Filters</VisuallyHidden>;
```

`focusable` reveals the element under keyboard focus and fixes it to the window's start corner on
the `fill.surface` layer style, so a keyboard user sees the control that has focus.

| Axis        | Values | Default |
| ----------- | ------ | ------- |
| `focusable` | `true` | off     |

## SkipNav

`SkipNav.Link` moves keyboard focus past a repeated block of content, such as the navigation.
`SkipNav.Target` receives focus when the link is followed. Place the link first in the document, so
it is the first element Tab focuses.

```tsx
import { SkipNav } from "@stealthscale/component-a11y";

<SkipNav.Link>Skip to content</SkipNav.Link>;
<SkipNav.Target as="main">…</SkipNav.Target>;
```

The link is clipped until keyboard focus, and then fixed to the window's start corner. Its `href`
defaults to `#content` and the target's `id` to `content`, exported as `SKIP_NAV_TARGET`. The target
has `tabIndex` -1, because a browser moves focus only to a focusable fragment target. A page with
another landing place sets both: `<SkipNav.Link href="#results">` and
`<SkipNav.Target id="results">`.

## RovingFocus

`RovingFocus.Root` keeps one tab stop for the `RovingFocus.Item` elements below it. Tab reaches the
group, and the arrow keys move focus inside it, as the toolbar, tab list and menu bar patterns
require. Home and End move to the ends, a disabled item is skipped, and the inline arrows reverse in
a right-to-left group.

```tsx
import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { RovingFocus } from "@stealthscale/component-a11y";

<RovingFocus.Root aria-label="Formatting" role="toolbar" wrap>
  <ButtonPropsProvider value={{ variant: "outline" }}>
    <RovingFocus.Item as={Button}>Bold</RovingFocus.Item>
    <RovingFocus.Item as={Button}>Italic</RovingFocus.Item>
  </ButtonPropsProvider>
</RovingFocus.Root>;
```

The root has no role. The caller sets it, and the root writes `aria-orientation` only with a role,
because the attribute has no meaning on a generic element. Render a control as the item with `as`. A
control nested inside an item adds a second tab stop.

| Axis          | Values                           | Default      |
| ------------- | -------------------------------- | ------------ |
| `orientation` | `horizontal`, `vertical`, `both` | `horizontal` |

`wrap` continues a step past one end at the other. `defaultActiveId` sets the item Tab enters first.
`activeId` and `onActiveIdChange` control the tab stop from outside.

## Types

| Type                    | Props of                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| `VisuallyHiddenProps`   | `VisuallyHidden`: the recipe's variants and a `span`'s props      |
| `SkipNav.LinkProps`     | `SkipNav.Link`: an `a` element's props                            |
| `SkipNav.TargetProps`   | `SkipNav.Target`: a `div` element's props                         |
| `RovingFocus.RootProps` | `RovingFocus.Root`: the focus options and a `div` element's props |
| `RovingFocus.ItemProps` | `RovingFocus.Item`: `disabled`, `id`, `ref` and a `div`'s props   |

`RovingFocus.Orientation` is the union of the three orientations. `VisuallyHiddenPropsProvider` sets
`focusable` on every `VisuallyHidden` below it.

## Licence

MIT. See [LICENSE](LICENSE).
