# @stealthscale/component-feedback

Draws the system reporting on itself: what is loading, what went wrong, what state a thing is in.
Every component binds a recipe and draws nothing of its own, so a theme restyles all of them by
extending the recipe. The preset under `./theme` registers the recipes with an application's
compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-feedback
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Alert

Draws a notice about something a reader needs to know, composed as `Alert.Root` holding a mark, the
words, and whatever they do about it.

```tsx
import { Alert } from "@stealthscale/component-feedback";

<Alert.Root live="assertive" status="error">
  <Alert.Indicator>
    <WarningIcon />
  </Alert.Indicator>
  <Alert.Content>
    <Alert.Title>Payment failed</Alert.Title>
    <Alert.Description>The card was declined.</Alert.Description>
  </Alert.Content>
  <Alert.Aside>
    <IconButton aria-label="Dismiss this warning" />
  </Alert.Aside>
</Alert.Root>;
```

| Axis      | Values                                           | Default   |
| --------- | ------------------------------------------------ | --------- |
| `status`  | `info`, `success`, `warning`, `error`, `neutral` | `info`    |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain` | `subtle`  |
| `size`    | `sm`, `md`, `lg`                                 | `md`      |
| `layout`  | `stacked`, `inline`                              | `stacked` |
| `radius`  | `l1`, `l2`, `l3`, `full`                         | `l3`      |
| `motion`  | `fade`, `rise`, `reveal`                         | none      |

| Part          | Element | What it draws                           |
| ------------- | ------- | --------------------------------------- |
| `Root`        | `div`   | The box, and how loudly it is announced |
| `Indicator`   | `div`   | A mark, hidden from a screen reader     |
| `Content`     | `div`   | The title and the description           |
| `Title`       | `span`  | What the alert is about                 |
| `Description` | `span`  | The rest of it                          |
| `Aside`       | `div`   | What a reader does about it             |

`live` sets the role that announces the alert:

| `live`      | Role     | Reach for it when                                   |
| ----------- | -------- | --------------------------------------------------- |
| `assertive` | `alert`  | The alert answers something a person just did       |
| `polite`    | `status` | The alert reports progress and can wait for a pause |
| `off`       | none     | The alert is on the page from the first paint       |

The default is `polite`. Take `off` for notices present at load. Keep a live region mounted and
empty and fill it, rather than mounting it with its words already in place.

Say the status in the title's words. The indicator is hidden from a screen reader, and an alert
whose status reaches a reader through its palette and its mark alone fails WCAG 1.4.1.

Name a control in the aside for what it acts on: `Dismiss this warning` rather than `Dismiss`.

`Alert.Title` is a `span`. Take `as="h2"` for a notice that stays on the page and belongs in its
outline.

## Skeleton

Draws a placeholder while content loads. Wrap the content rather than replacing it, and the
placeholder takes its size without a width. It hides what it wraps while `loading` holds, and fades
out once the content arrives.

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

The element carries no role. State `aria-busy` on the region that is waiting.

## SkeletonText

Draws a placeholder for a paragraph. Each bar is one line tall and the space between two is half a
line, both read off the surrounding text, so the page does not jump when the real words arrive.

```tsx
import { SkeletonText } from "@stealthscale/component-feedback";

<SkeletonText />;
<SkeletonText lines={5} motion="shimmer" />;
```

The last bar of several is short. `lines` defaults to three and never draws fewer than one. Draw
this while the text loads and the text itself once it arrives. It takes no loading state.

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

Draws the panel a page shows where there is nothing to show, composed as `EmptyState.Root` holding a
mark, a heading and a line saying what would be here.

```tsx
import { EmptyState } from "@stealthscale/component-feedback";

<EmptyState.Root size="lg">
  <EmptyState.Content>
    <EmptyState.Indicator aria-hidden>
      <InboxIcon />
    </EmptyState.Indicator>
    <EmptyState.Title>No invoices yet</EmptyState.Title>
    <EmptyState.Description>Send your first one to get started.</EmptyState.Description>
  </EmptyState.Content>
</EmptyState.Root>;
```

| Axis   | Values                                            | Default |
| ------ | ------------------------------------------------- | ------- |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`    |

One `size` moves four parts: the room inside the panel, the gap in the content, the box of the mark
and the size of the title. The description holds its size at every step.

Pass a glyph to the mark without sizing it. State `aria-hidden` on it, since the title says the same
thing in words.

The title is an `h2`. State your own level with `as` where the page's outline puts it deeper. The
root carries no role.

## Licence

MIT. See [LICENSE](LICENSE).
