# @stealthscale/component-feedback

React components that report state: `Alert`, `Skeleton`, `SkeletonText`, `Spinner`, `Loader` and
`EmptyState`. Each component renders through a recipe, so a theme restyles it by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can change is a recipe axis, and a caller sets it as a prop. A caller changes
the rendered element with `as`.

## Install

```bash
pnpm add @stealthscale/component-feedback
```

The package peers on `react` and `@stealthscale/theme`. Add the preset under `./theme` to the
presets the application's compiler installs.

## Alert

Renders a notice the reader needs to act on or know about. Compose it as `Alert.Root` around an
icon, the text, optional trailing controls and a close trigger.

```tsx
import { Alert } from "@stealthscale/component-feedback";

<Alert.Root live="assertive" status="error">
  <Alert.Indicator>
    <TriangleAlertIcon />
  </Alert.Indicator>
  <Alert.Content>
    <Alert.Title>Payment failed</Alert.Title>
    <Alert.Description>The card was declined.</Alert.Description>
  </Alert.Content>
  <Alert.CloseTrigger label="Dismiss payment failed" onClick={dismiss}>
    <XIcon />
  </Alert.CloseTrigger>
</Alert.Root>;
```

| Axis      | Values                                           | Default   |
| --------- | ------------------------------------------------ | --------- |
| `status`  | `info`, `success`, `warning`, `error`, `neutral` | `info`    |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain` | `subtle`  |
| `size`    | `sm`, `md`, `lg`                                 | `md`      |
| `layout`  | `stacked`, `inline`                              | `stacked` |
| `radius`  | `l1`, `l2`, `l3`, `full`                         | `l3`      |
| `edge`    | `top`, `bottom`, `end`                           | none      |
| `motion`  | `fade`, `rise`, `reveal`                         | none      |

| Part           | Element  | What it renders                                   |
| -------------- | -------- | ------------------------------------------------- |
| `Root`         | `div`    | The container, with the role of its `live` level  |
| `Indicator`    | `div`    | The icon, sized by the recipe, `aria-hidden`      |
| `Content`      | `div`    | The title and the description                     |
| `Title`        | `span`   | The headline, which states the severity           |
| `Description`  | `span`   | The supporting text                               |
| `Aside`        | `div`    | Trailing controls such as a retry button          |
| `CloseTrigger` | `button` | The dismiss control, named by `label` (`Dismiss`) |

`live` sets the role that announces the alert:

| `live`      | Role     | Use it for                               |
| ----------- | -------- | ---------------------------------------- |
| `assertive` | `alert`  | An alert raised by a user action         |
| `polite`    | `status` | Progress that can wait for a pause       |
| `off`       | none     | A notice present from the initial render |

The default is `polite`. Keep a live region mounted and empty and write into it, because screen
readers do not reliably announce a region mounted with its text.

State the severity in the title. The indicator is `aria-hidden`, and an alert that conveys its
status through color and icon alone fails WCAG 1.4.1.

`Alert.CloseTrigger` takes the alert's ink, so it matches every look and status. On the solid look
it hovers to a tint of the contrast ink and draws its focus ring in the contrast ink. The box is
1.5em square and at least 24px, and the glyph sits on the padding edge. Pass a `label` that names
the notice. Name each control in `Alert.Aside` for its target too, such as `Retry the payment`.

`Alert.Title` is a `span`. Pass `as="h2"` for a notice that stays on the page and belongs in the
outline. Under forced colors the root draws a hairline `CanvasText` outline.

## Skeleton

Renders a placeholder over content that is still loading. Wrap the content in the skeleton, so the
placeholder takes the content's size and the layout does not shift when `loading` turns off.

```tsx
import { Skeleton } from "@stealthscale/component-feedback";

<Skeleton loading={pending}>
  <Avatar src={person.photo} />
</Skeleton>;
<Skeleton motion="shimmer" radius="full" />;
```

| Axis      | Values                     | Default |
| --------- | -------------------------- | ------- |
| `loading` | `true`, `false`            | `true`  |
| `motion`  | `none`, `pulse`, `shimmer` | `pulse` |
| `radius`  | `l1`, `l2`, `l3`, `full`   | `l2`    |

The element has no role. Set `aria-busy` on the region that is loading. The animations stop under
reduced motion. Under forced colors a loading skeleton draws a hairline `GrayText` outline, because
the browser replaces its fill.

## SkeletonText

Renders a placeholder paragraph with one bar per line. Each bar is one line height tall and the bars
are half a line height apart, both in `lh` units of the surrounding text.

```tsx
import { SkeletonText } from "@stealthscale/component-feedback";

<SkeletonText />;
<SkeletonText lines={5} motion="shimmer" />;
```

The last of several bars is 80% wide. `lines` defaults to 3 and renders at least one bar. Render the
placeholder while the text loads and the text once it arrives. The component has no `loading` prop.

## Spinner

Shows that work is running when there is no progress to report. Where the work reports how far along
it is, show a progress indicator instead.

```tsx
import { Button } from "@stealthscale/component-actions";
import { Spinner } from "@stealthscale/component-feedback";

<Spinner />;
<Spinner palette="primary" size="lg" stroke="heavy" track />;
<Spinner effect="glow" palette="accent" />;
<Button disabled>
  <Spinner size="inherit" />
  Saving
</Button>;
```

| Axis      | Values                                                                        | Default     |
| --------- | ----------------------------------------------------------------------------- | ----------- |
| `size`    | `inherit`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                  | `md`        |
| `palette` | `current`, `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `current`   |
| `stroke`  | `hairline`, `control`, `indicator`, `heavy`                                   | `indicator` |
| `track`   | `true`                                                                        | off         |
| `effect`  | `glow`, `pulse`                                                               | none        |

The element is an empty `span` with no role, so a screen reader skips it. Write the words the wait
needs beside it, and set `aria-busy` on the region that is waiting.

`palette` draws the arc in the palette's `solid` color. The theme engine keeps every `solid` at 3:1
or more against the page. `current` draws it in the surrounding ink, which is the label ink inside a
button. `inherit` sizes the spinner to the surrounding font size, so it keeps a line of text or a
button at its height.

`stroke` reads the theme's semantic widths, so a theme with heavier controls draws a heavier ring.
`heavy` is the 4px step, heavier than the `indicator` stroke of every published theme.

The arc turns on the theme's `spin` animation style, so it stops when the reader prefers reduced
motion. The words beside it still say what is happening. In forced colors mode the arc is drawn in
`CanvasText` and the track in `GrayText`.

## Loader

Shows that something is loading, beside words or over the content it replaces. `LoaderOverlay`
covers a positioned container while its content loads.

```tsx
import { Button } from "@stealthscale/component-actions";
import { Loader, LoaderOverlay } from "@stealthscale/component-feedback";
import { Card } from "@stealthscale/component-surfaces";

<Loader text="Matching" />;
<Loader placement="end" palette="primary" text="Matching" />;
<Button disabled={saving}>
  <Loader label="Saving changes" loading={saving}>
    Save changes
  </Loader>
</Button>;
<Card.Root>
  …
  <LoaderOverlay scrim="glass">
    <Loader text="Matching" />
  </LoaderOverlay>
</Card.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | inherited |
| `scrim`   | `veil`, `glass`, `none`, on `LoaderOverlay`                        | `veil`    |

| Prop        | Type           | Default   | Effect                                             |
| ----------- | -------------- | --------- | -------------------------------------------------- |
| `loading`   | `boolean`      | `true`    | With `false`, the children render unchanged        |
| `text`      | `ReactNode`    | none      | Renders the words beside the spinner, not children |
| `placement` | `start`, `end` | `start`   | The side of the words the spinner is rendered on   |
| `label`     | `string`       | `Loading` | Read by screen readers in place of hidden children |
| `spinner`   | `ReactNode`    | a spinner | Replaces the default spinner                       |

With `text`, the loader renders the spinner and the words in one inline row, so they stay on one
line in any container. Without `text`, the loader hides its children with `visibility: hidden` and
centres the spinner over them in the same grid cell. The children keep their box, so a button keeps
its width and a row does not reflow when the content returns. The loader needs no positioned
ancestor.

Hidden children leave the accessibility tree, so the loader renders `label` in their place for
screen readers. Set `aria-busy` on the region that is loading.

The default spinner is at `inherit` and `current`, so it takes the size and the ink of the
surrounding text. `palette` draws it in the palette's `solid` color instead. Pass `spinner` to
change its stroke, track or effect.

`LoaderOverlay` is absolutely positioned at `inset: 0` and takes its container's corner radius, so
the container must be positioned, as `Card.Root` is. `veil` fills it with the panel at 80% opacity
and `glass` blurs the content behind it.

## EmptyState

Renders the panel a surface shows when it has no content. Compose it as `EmptyState.Root` around an
`EmptyState.Content` column of an icon, a title and a description.

```tsx
import { EmptyState } from "@stealthscale/component-feedback";

<EmptyState.Root size="lg">
  <EmptyState.Content>
    <EmptyState.Indicator>
      <InboxIcon />
    </EmptyState.Indicator>
    <EmptyState.Title>No invoices yet</EmptyState.Title>
    <EmptyState.Description>Send your first one to get started.</EmptyState.Description>
  </EmptyState.Content>
</EmptyState.Root>;
```

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

`size` sets four values together:

| Size | Icon | Title        | Gap  | Inset |
| ---- | ---- | ------------ | ---- | ----- |
| `sm` | 32px | `heading.xs` | 8px  | 24px  |
| `md` | 40px | `heading.sm` | 12px | 32px  |
| `lg` | 50px | `heading.md` | 16px | 40px  |

The icon has twice the gap below it, so the title and the description read as one group. The
description stays at `body.sm`. Pass the icon without a size. The indicator is `aria-hidden` by
default, because the title states the same thing in words.

The title is an `h2`. Pass a deeper level with `as` where the page outline requires it. The root has
no role.

## Licence

MIT. See [LICENSE](LICENSE).
