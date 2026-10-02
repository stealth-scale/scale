# @stealthscale/component-typography

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`d577ce3`](https://github.com/stealth-scale/scale/commit/d577ce3a013b0af1f6cd2dce358f496382a58616) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Em`, `Strong`, `Mark`, `Quote` and `Span`.
  - Add `Highlight` over `useHighlight`, and peer on `@stealthscale/hooks`.
  - Add `tone="subtle"` to `Text`, `Heading`, `Strong` and `Em`.
  - Add `display` to `Heading`.
  - Add `mask` values `edges` and `radial` to `Text`.
  - Offer every `Text` ink on `Icon`.
  - Break words wider than their container in `Text` and `Heading`.
  - Breaking: `Mark`, `Code` and `Blockquote.Root` take `palette` in place of `status`.
  - Breaking: `Kbd` is a namespace: `Kbd.Root` and `Kbd.Group`. `Kbd.Root` takes `palette`.
  - Size keycaps from the tag scale: 19.2, 21.6 and 24px.
  - Hang the blockquote's mark in a gutter, and add the `surface` look.
  - Add `inset="none"` to `Mark`.
  - Forward `start` from `List.Root`.
  - Fix `Icon` overriding an icon's own `fill`.
  - Fix a mirrored `Icon` losing its mirror while spinning.
  - Render code and flat keycaps without a hover state.
  - Add a specimen per component.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Emit every status value through `statusEmitted()` in `staticCss` of every recipe with a `status`
    axis.
- Updated dependencies [[`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`ca48c3d`](https://github.com/stealth-scale/config/commit/ca48c3d51cef1b85ea6d103077a0e2f21e097911) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-typography: publish the first seven components
  
  - `Text`, `Heading`, `Code`, `Kbd` and `Icon` each bind one element through the compiler's factory,
    so a caller changes the element with `as`. `List` and `Blockquote` are published as namespaces of
    their parts, `List.Root` and `Blockquote.Content`.
  - Every axis the vocabulary lets a theme move on a component is an axis of its recipe: the body and
    heading roles as sizes, the foreground roles as tones, the looks, the statuses, the semantic
    scales, and the text effects, masks and motions as `effect`, `mask` and `motion`.
  - `Icon` states the `img` role, so a label a caller gives it names the graphic in every screen
    reader. `List.Indicator` is hidden from assistive technology, as the browser's bullet is.
  - A heading balances its lines and a paragraph wraps prettily, so neither leaves one word alone on
    its last line.
  - `List` takes a `marker`: the three bullets, a dash, decimal with or without a leading zero, roman
    and alphabetic numbering in both cases, and greek letters. The element's own marker stays until a
    caller picks one.
  - The sizes run on the foundation's full scale where a component has a use for the step: `Heading`
    and `Icon` from `xs` to `4xl`, `Text` from `xs` to `xl`, and `List` gaps to `4xl`.
  - `Icon` fills its artwork in the current colour, so a path with no fill of its own follows the ink
    into dark mode rather than staying black.
  - The preset under `./theme` registers all seven recipes.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
