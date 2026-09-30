# @stealthscale/component-feedback

React components that report state: `Alert`, `Skeleton`, `SkeletonText`, `Spinner`, `Loader`,
`Progress`, `ProgressCircle`, `Meter`, `EmptyState` and `Toast`. Each component renders through a
recipe, so a theme restyles it by extending the recipe. The preset under `./theme` registers the
recipes with an application's compiler.

Every value a theme can change is a recipe axis, and a caller sets it as a prop. A caller changes
the rendered element with `as`.

## Install

```bash
pnpm add @stealthscale/component-feedback
```

The package peers on `react`, `@stealthscale/theme` and `@stealthscale/hooks`. It depends on
`@zag-js/progress`, which tracks the value of a progress bar and a meter, and `@zag-js/toast`, which
runs the toasts. Add the preset under `./theme` to the presets the application's compiler installs.

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
`max(24px, 1.5em)` square, and its glyph is aligned with the padding edge. Pass a `label` that
includes the notice's title. Label each control in `Alert.Aside` with its target, such as
`Retry the payment`.

`edge` draws a border in the palette's `solid` along one edge, so the rule follows the rounded
corners. `end` is the right edge in a left-to-right document and the left edge in a right-to-left
one.

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

With two or more lines the last bar is 80% wide. `lines` defaults to 3 and renders at least one bar.
Render the placeholder while the text loads and the text once it arrives. The component has no
`loading` prop.

## Spinner

Shows that work is running when there is no progress to report. Where the work reports how far along
it is, show `Progress` instead.

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

## Progress

Reports how far a task has come. The root runs the Zag progress machine. The track is the progress
bar a screen reader reports, with `role="progressbar"`, the value range and the formatted value.

```tsx
import { Progress } from "@stealthscale/component-feedback";

<Progress.Root value={62}>
  <Progress.Label>Reconciling payouts</Progress.Label>
  <Progress.ValueText />
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>;
<Progress.Root value={null}>
  <Progress.Label>Preparing the export</Progress.Label>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>;
```

| Part        | Element | What it renders                                                             |
| ----------- | ------- | --------------------------------------------------------------------------- |
| `Root`      | `div`   | A grid of the label, the value and the track, with the machine and variants |
| `Label`     | `span`  | The words that name the bar                                                 |
| `ValueText` | `span`  | Its children, or the formatted value, `62%` by default                      |
| `Track`     | `div`   | The progress bar, with the machine's role and value range                   |
| `Range`     | `div`   | The fill, as wide as the value's share of the track                         |
| `Segment`   | `span`  | One part of the fill, as wide as its value's share of the range             |
| `Marker`    | `div`   | A tick across the track at a value, such as a target                        |

| Axis       | Values                                                             | Default   |
| ---------- | ------------------------------------------------------------------ | --------- |
| `size`     | `xs`, `sm`, `md`, `lg`, `xl`                                       | `md`      |
| `variant`  | `subtle`, `outline`                                                | `outline` |
| `shape`    | `square`, `rounded`, `full`                                        | `full`    |
| `palette`  | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |
| `layout`   | `stacked`, `inline`                                                | `stacked` |
| `striped`  | `true`                                                             | off       |
| `animated` | `true`                                                             | off       |
| `effect`   | `glow`, `pulse`                                                    | none      |

`value` sets the value between `min` and `max`, 0 and 100 by default. Without `value` or
`defaultValue` the machine starts at the midpoint. `null` is a value the machine does not know. The
track then leaves out `aria-valuenow`, the value text is empty, and a segment of the range crosses
the track once every 1.2 seconds. `formatOptions` and `locale` format the value with
`Intl.NumberFormat`, as a percentage by default.

The size is the track's thickness: 4, 6, 8, 12 and 16px. The label and the value keep the label
style at every size. `inline` puts the label, the track and the value on one row, and the track
takes the room the words leave. `animated` moves the stripes at 40px a second, adding them where
`striped` is not set. Both motions stop for a reader who asked for less motion, and the segment then
spreads over the whole track.

### Markers and segments

```tsx
<Progress.Root max={1200} value={864}>
  <Progress.Label>Test run</Progress.Label>
  <Progress.ValueText>864 of 1,200</Progress.ValueText>
  <Progress.Track aria-valuetext="864 of 1,200">
    <Progress.Segment color="success" value={812} />
    <Progress.Segment color="error" value={12} />
    <Progress.Segment color="neutral" value={40} />
    <Progress.Marker value={900} />
  </Progress.Track>
</Progress.Root>
```

- `Marker` places a tick at its `value`'s share of the range, from `min` to `max`. A value past
  either end is placed at that end, inside the track.
- The tick is as wide as the theme's `indicator` border, 2px unless the theme states another, and
  150% of the track's thickness. It is painted in `fg` with a hairline edge in `bg.panel`, so the
  tick or its edge contrasts with the range and with the track.
- `Segment` fills the track from its start in the order the segments render, in place of `Range`.
  Each segment is as wide as its `value`'s share of `max - min`.
- The first eight segments take `series.1` to `series.8` in order, the colors a chart gives its
  series, and the ninth starts again at `series.1`. `color` picks one series color, or a palette
  whose `solid` fills the segment.
- The first segment takes the track's start corners and the last segment takes its end corners.
  Segments that add up to more than the range shrink in proportion.
- The track reports the root's `value`, so pass the segments' sum.
- Label each color in a key beside the bar. Compose the key from the data package's `ColorSwatch`,
  with `var(--colors-series-1)` for a series color, or from its `Status` for a palette.

### Accessibility

- A rendered `Progress.Label` names the track through `aria-labelledby`. A bar without a label takes
  `aria-label` on `Progress.Track`.
- The marker and the segments are hidden from assistive technology. Write the marked value in
  `ValueText` and in the track's `aria-valuetext`, and list the parts in a key.
- The track states the formatted value as `aria-valuetext`. For a count in the caller's units, pass
  `aria-valuetext` to the track and the same words to `Progress.ValueText`.
- `Progress.ValueText` is not a live region, so a screen reader does not announce every change. Pass
  `aria-live="polite"` to announce them.
- Under forced colors the range fills with `Highlight`, and the track has a hairline `CanvasText`
  outline. The marker is `CanvasText` with a `Canvas` edge. The segments keep their colors, and a
  `Canvas` hairline separates each segment from the one before it.

### Machine options

The root takes `value`, `defaultValue`, `onValueChange`, `min`, `max`, `formatOptions`, `locale`,
`id`, `ids` and `dir`. It does not take `orientation`, because the recipe styles a horizontal track
only, or `translations`, because the words are the caller's. The machine's `view` part is not
offered. Its circle parts are `ProgressCircle`.

## ProgressCircle

Reports how far a task has come as a ring, with the value in its middle. It runs the same machine as
`Progress`. The ring is the progress bar a screen reader reports.

```tsx
import { ProgressCircle } from "@stealthscale/component-feedback";

<ProgressCircle.Root size="lg" value={62}>
  <ProgressCircle.Circle>
    <ProgressCircle.Track />
    <ProgressCircle.Range />
  </ProgressCircle.Circle>
  <ProgressCircle.ValueText />
  <ProgressCircle.Label>Uploading the report</ProgressCircle.Label>
</ProgressCircle.Root>;
```

| Part        | Element  | What it renders                                            |
| ----------- | -------- | ---------------------------------------------------------- |
| `Root`      | `div`    | A grid of the ring, the value in its middle and the label  |
| `Circle`    | `svg`    | The progress bar, with the machine's role and value range  |
| `Track`     | `circle` | The whole ring                                             |
| `Range`     | `circle` | The part of the ring from the top to the value             |
| `ValueText` | `span`   | Its children, or the formatted value, in the ring's middle |
| `Label`     | `span`   | The words that name the ring, under it or beside it        |

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                                       | `md`      |
| `variant` | `subtle`, `outline`                                                | `outline` |
| `shape`   | `square`, `full`                                                   | `full`    |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |
| `layout`  | `stacked`, `inline`                                                | `stacked` |

- The ring is 24, 32, 40, 48 and 64px wide, and 4, 4, 4, 6 and 8px thick, from `xs` to `xl`.
- The value text shows from `md` up, in the largest text style whose "100%" fits inside the ring.
  `xs` and `sm` hide it. The ring's `aria-valuetext` states the value at every size.
- `stacked` puts the label under the ring. `inline` puts it beside the ring.
- The root is as wide as its content. A flex column or a grid does not stretch it.
- `shape` rounds or squares the ends of the range.
- `outline` strokes the track in the muted ground. `subtle` strokes it in the palette's muted role.
- `null` is a value the machine does not know. The ring then leaves out `aria-valuenow`. A quarter
  arc turns once every 1.2 seconds.
- For a reader who asked for less motion, the ring stops, and the range is a dashed line around the
  whole ring.
- The root takes the same machine options as `Progress.Root`.

### Accessibility

- A rendered `ProgressCircle.Label` names the ring through `aria-labelledby`. A ring without a label
  takes `aria-label` on `ProgressCircle.Circle`.
- The ring states the formatted value as `aria-valuetext`. For a count in the caller's units, pass
  `aria-valuetext` to `ProgressCircle.Circle`. Pass the short form, such as `3/5`, as the children
  of `ProgressCircle.ValueText`.
- `ProgressCircle.ValueText` is not a live region. Pass `aria-live="polite"` to announce each
  change.
- Under forced colors the range strokes in `Highlight`. The track is a hairline `CanvasText` circle
  at the ring's outer edge.

## Meter

Shows a measurement within a known range, such as the storage an account uses. A meter is the
progress bar under a root of its own: `Meter.Root` renders `Progress.Root` with the track in the
`meter` role, and every other part is the progress bar's. The track is the meter a screen reader
reports, with the value range and the formatted value. A meter's value changes only when its caller
measures again. A progress bar reports a task that is still running.

```tsx
import { Meter } from "@stealthscale/component-feedback";

<Meter.Root formatOptions={{ style: "unit", unit: "gigabyte" }} max={50} value={38.2}>
  <Meter.Label>Storage used</Meter.Label>
  <Meter.ValueText />
  <Meter.Track>
    <Meter.Range />
  </Meter.Track>
</Meter.Root>;
<Meter.Root max={268} palette="success" value={268}>
  <Meter.Label>Deals closed this quarter</Meter.Label>
  <Meter.ValueText>268 / 250</Meter.ValueText>
  <Meter.Track aria-valuetext="268, target 250">
    <Meter.Range />
    <Meter.Marker value={250} />
  </Meter.Track>
</Meter.Root>;
```

| Part        | Element | What it renders                                                 |
| ----------- | ------- | --------------------------------------------------------------- |
| `Root`      | `div`   | The progress bar's root, with the track in the `meter` role     |
| `Label`     | `span`  | The words that name the meter                                   |
| `ValueText` | `span`  | Its children, or the formatted value, `62%` by default          |
| `Track`     | `div`   | The meter, with `role="meter"` and the value range              |
| `Range`     | `div`   | The fill, as wide as the value's share of the track             |
| `Segment`   | `span`  | One part of the fill, such as the photos in a disk's used space |
| `Marker`    | `div`   | A tick across the track at a value, such as a target            |

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                                       | `md`      |
| `variant` | `subtle`, `outline`                                                | `outline` |
| `shape`   | `square`, `rounded`, `full`                                        | `full`    |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |
| `layout`  | `stacked`, `inline`                                                | `stacked` |

- `value` is a required number between `min` and `max`, 0 and 100 by default, and never `null`.
  `formatOptions` and `locale` format it with `Intl.NumberFormat`, as a percentage unless
  `formatOptions` states another style.
- The meter renders the progress recipe, so its elements take the progress bar's classes, such as
  `progress__track`, and the tracks of a meter and a progress bar in one column start and end at the
  same edges.
- The root does not take `defaultValue` or `onValueChange`, because only the caller changes a
  meter's value.
- The root does not take `striped`, `animated` or `effect`. Those motions mark work under way, and a
  meter reports a measurement.
- The caller picks `palette` from its own threshold, because a share is neither good nor bad by
  itself: 90% is good news for a download and bad news for a disk.
- For a measure against a target, set `max` to the larger of the two and mark the target with
  `Meter.Marker`. A measure past its target then fills the track.
- `Meter.Segment` and `Meter.Marker` work as they do on the progress bar.

### Accessibility

- A rendered `Meter.Label` names the track through `aria-labelledby`. A meter without a label takes
  `aria-label` on `Meter.Track`.
- The track states the formatted value as `aria-valuetext`. For a value in words, such as a
  password's strength or a target, pass `aria-valuetext` to the track and the same words to
  `Meter.ValueText`.
- `Meter.ValueText` is not a live region.
- A meter split into the parts of a whole sets `value` to `max` and reports 100%. Pass the parts as
  its `aria-valuetext`, joined with `Intl.ListFormat`.

### Not offered

- Thresholds such as the `low`, `high` and `optimum` of the HTML `meter` element. The caller picks
  the palette.
- An orientation.

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

## Toast

Raises a short message into a region fixed to an edge of the window. Create one toaster in a module
the application shares, render its `Toast.Region` once at the application's root, and raise toasts
into the toaster from anywhere.

```tsx
import { XIcon } from "lucide-react";

import { Toast } from "@stealthscale/component-feedback";

export const toaster = Toast.createToaster({ placement: "bottom-end" });

<Toast.Region toaster={toaster}>
  {(toast) => (
    <Toast.Root>
      <Toast.Content>
        <Toast.Title>{toast.title}</Toast.Title>
        <Toast.Description>{toast.description}</Toast.Description>
      </Toast.Content>
      <Toast.CloseTrigger>
        <XIcon />
      </Toast.CloseTrigger>
    </Toast.Root>
  )}
</Toast.Region>;

toaster.success({ description: "€1,240.00 is on its way.", title: "Payout sent" });
```

| Part            | Element  | What it renders                                                |
| --------------- | -------- | -------------------------------------------------------------- |
| `Region`        | `div`    | The region of one toaster, and each toast through its function |
| `Root`          | `div`    | One toast, with `role="status"`                                |
| `Indicator`     | `span`   | The caller's glyph in the type's palette, `aria-hidden`        |
| `Content`       | `div`    | The column of the title and the description                    |
| `Title`         | `div`    | The title the toast is named by                                |
| `Description`   | `div`    | The text the toast is described by                             |
| `ActionTrigger` | `button` | The button that runs the toast's action and dismisses it       |
| `CloseTrigger`  | `button` | The button that dismisses the toast                            |

- `Toast.createToaster` takes the store's options: `placement` (`top-start`, `top`, `top-end`,
  `bottom-start`, `bottom`, `bottom-end`, default `bottom`), `max` (24), `overlap`, `gap` (16px),
  `offsets` (`1rem`), `duration`, `removeDelay` (200 ms), `hotkey` (Alt+T) and `pauseOnPageIdle`
  (true). Its toaster raises toasts with `create`, `success`, `error`, `warning`, `info`, `loading`
  and `promise`, and changes them with `update`, `dismiss`, `pause` and `resume`.
- The region is a `region` landmark named `<label>, <placement> (alt+T)`, with `label`
  `Notifications` by default, and announces each new toast through `aria-live="polite"`. Alt+T moves
  focus to it. The region's id comes from the placement, so render one region per placement.
- A toast closes after 5 seconds, a `success` toast after 2 and a `loading` toast never. `duration`
  sets another. A pointer resting on the region or focus inside it pauses every toast, and the
  region pauses every toast while the page is hidden.
- The type sets the toast's palette: `success`, `error`, `warning`, `info`, and `neutral` for
  `loading`. The indicator inks the caller's glyph in the palette's solid. Pass a `Spinner` for a
  loading toast.
- A toast is in the tab order, and Escape dismisses the focused toast. The close trigger is named
  "Dismiss notification" unless you pass `aria-label`.
- With `overlap`, the toasts overlap until a pointer rests on the region or focus enters it. Past
  `max`, the toaster queues toasts, errors first.
- A toast is at most `sizes.sm` wide, 384px at the default scale, and never wider than the window
  less the offsets. The recipe has no axes.
- A missed toast is gone. Put nothing a reader needs only in a toast, and give a toast with an
  action a longer `duration`.

## Licence

MIT. See [LICENSE](LICENSE).
