---
"@stealthscale/component-feedback": minor
---

component-feedback: stand a skeleton in on the neutral fills

- A loading skeleton is drawn in the neutral palette's muted fill, and its shimmer runs from the
  muted fill to the emphasized one. The fills lift above a dark page where the wells it stood on
  sank below it, so a placeholder reads as something on its way rather than as a hole in the page.

component-feedback: publish Alert

- `Alert` draws a notice about something a reader needs to know. Six parts under one namespace:
  `Root`, `Indicator`, `Content`, `Title`, `Description` and `Aside`.
- `live` decides the role that announces it: `assertive` draws `role="alert"`, `polite` draws
  `role="status"`, and `off` draws neither. The default is `polite`. A page of notices present at
  load takes `off`, because a screen reader announces a live region on mount and would read every
  one of them out before a reader has asked for anything.
- The indicator states `aria-hidden` by default. It repeats what the title says, so the status
  reaches a reader in words rather than through a palette and a glyph, which WCAG 1.4.1 fails.
- `Alert.Title` is a `span`. A heading inside a live region puts a level into the page's outline for
  something that is gone a moment later. A notice the page keeps takes `as="h2"`.
- `Aside` holds what a reader does about the alert, which the source had no part for.
- Six axes: `status` over the four intents and `neutral`, `variant` over the five flat looks,
  `size`, `layout` at `stacked` or `inline`, `radius` and `motion`.
- The status names an intent rather than a hue, so a theme repointing `error` reaches every alert.
  Every other value is a semantic token, a layer style or a text style. The looks read the `flat`
  layer styles, whose fill and ink are the palette pairs the contrast gate measures, and the
  indicator takes no colour of its own so a solid alert marks itself in the measured ink.
- The content band holds a minimum inline size of zero, so a long word wraps rather than pushing the
  aside off the end.

component-feedback: stop a loaded skeleton moving

- The fade a skeleton reveals its content with is written in the recipe's base. It was written at
  `loading: false`, which the compiler drops because a boolean axis carries no class at `false`, so
  the content never faded in.
- Each motion is written under the class the loading state carries, so a skeleton that has loaded
  keeps neither the pulse nor the shimmer nor the surface it pulsed on. The surface a skeleton
  stands in on is now part of `loading`, so a still skeleton is drawn too.

component-feedback: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-feedback: reserve exactly the text a placeholder stands in for

- Each placeholder bar takes one line box with the bar drawn inside it. Three bars occupied 96
  pixels against 72 for three lines of text and six occupied 204 against 144, so loading pulled the
  page upward.
- The alert emits its neutral status beside the four semantic ones, which it offered and did not
  emit.

component-feedback: dismiss an alert in its own ink

- The alert's specimen draws its dismiss control as an extra small icon button in the alert's
  status: solid on a solid alert, where it reads in the contrast ink and its fill is the alert's
  own, and ghost on every other look, where it reads in the palette's ink beside the title. A
  neutral ghost control drew a dark cross on a solid fill.
- `Alert` takes an `edge` axis with `top`, `bottom` and `end`, which paints a bar in the palette's
  own colour along that edge. The three bars were drawn by the theme and reachable from nothing, and
  the bar reads the palette's solid so an alert's status colours it.
- `Alert` builds its `status` axis from `statusVariants()` with `neutral` beside it, the way the
  button and the badge do. It listed the same five values in another order.

component-feedback: add the spinner

- `Spinner` renders an empty `span` whose border draws a turning arc, through the theme's `spin`
  animation style. It stops under `prefers-reduced-motion`.
- The axes are `size` (the icon scale and `inherit`), `palette` (`current` and the eight semantic
  palettes, drawn in the palette's `solid`), `stroke` (`hairline`, `control`, `indicator` and the
  4px `heavy`), `track` (the ring in the palette's `muted`) and `effect` (`glow`, `pulse`).
- In forced colors mode the arc is drawn in `CanvasText` with `forced-color-adjust: none`. Without
  it Chromium paints all four sides, and the spinner is a closed ring with no visible turn.
- The element has no role. The caller writes the words beside it and sets `aria-busy` on the region
  that is waiting.

component-feedback: set the palette on the alert specimen's dismiss button

- The alert specimen passes the alert's status to its `IconButton` as `palette`, after
  `@stealthscale/component-actions` replaced the button's `status` axis with `palette`.
- The specimen renders `TriangleAlertIcon` and `XIcon` from `lucide-react` in place of hand-drawn
  SVG paths. The warning icon measured 16px in an `md` alert and the cross 12.6px in the `xs`
  button, the same sizes as the paths they replace.

component-feedback: add the loader

- `Loader` renders a spinner beside `text`, or centres it over hidden children. The children keep
  their box through `visibility: hidden`: a loading button measured 40 × 137.7px, the same as the
  loaded one. With `loading` false the children render unchanged.
- Over children, the root is an inline grid and the spinner shares the content's cell, so no
  positioned ancestor is needed. `label` (default `Loading`) is read by screen readers in place of
  the hidden children.
- `placement` renders the spinner at the `start` or the `end` of the words. `spinner` replaces the
  default spinner, which is at `inherit` and `current`.
- `LoaderOverlay` covers a positioned container at `inset: 0` with the container's corner radius.
- Axes: `palette` inks the spinner in a palette's `solid`, and `scrim` (`veil`, `glass`, `none`)
  fills the overlay. The default is `veil`, the panel color at 80% opacity.

component-feedback: show the source of every loader scene from an example file

- The loader specimen renders each scene from a file under `loader/examples/` and shows that file as
  its source. The text goes through `useWords`.
- `src/examples.spec.ts` renders the five loader examples and asserts that axe reports no violation.
- The examples lay out with `Stack`, so the package links `@stealthscale/component-layout` as a dev
  dependency.

component-feedback: add Alert.CloseTrigger and outline alerts under forced colors

- `Alert.CloseTrigger` renders a `button` with `type="button"`. `label` sets `aria-label` and
  defaults to `Dismiss`. The recipe draws it in the alert's ink with an `emphasized` hover fill, and
  on the solid look with a `contrast/20` hover and a contrast focus ring.
- The trigger is `max(24px, 1.5em)` square with a 1em glyph, and a negative end margin puts the
  glyph on the padding edge: 12, 16 and 20px from the end at `sm`, `md` and `lg`.
- `Alert.Indicator` stretches an `svg` child to its box, so an icon takes the icon size of the
  alert's size without a `size` prop: 16, 20 and 24px.
- Under forced colors the root draws a hairline `CanvasText` outline. The solid, subtle and plain
  looks lost their box when the browser replaced the fill.

component-feedback: resize the empty state to three sizes

- Breaking: `EmptyState.Root` takes `size` `sm`, `md` or `lg`. `xs` and `xl` to `4xl` are removed.
- The icon is 32, 40 and 50px over a `heading.xs`, `heading.sm` and `heading.md` title, with 8, 12
  and 16px gaps and 24, 32 and 40px of inset. At `md` the icon measured 20px over a 20px title, and
  the title reached 83px at `4xl`.
- `EmptyState.Indicator` sets `aria-hidden` by default.

component-feedback: space skeleton text bars with a column gap

- `SkeletonText` bars are `1lh` tall with a `0.5lh` gap on the column. The bars used a `content-box`
  clip inside a `1.5lh` box, which the skeleton's `loading` variant overrode with `padding-box`, so
  six bars rendered as one 216px block. The bars measure 24px with 12px gaps.
- A loading `Skeleton` draws a hairline `GrayText` outline under forced colors, where the browser
  replaced its fill and the placeholder disappeared.
