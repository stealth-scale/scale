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
