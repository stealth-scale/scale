# @stealthscale/component-actions

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Breaking: `Button` and `IconButton` take `palette` in place of `status`.
  - Breaking: remove `effect="ripple"`. Every button ripples on press.
  - Add `effect="pulse"`.
  - Fill a button with `aria-pressed="true"` or `aria-current="page"`, in every look and under forced
    colors.
  - Set the button's border width to `borderWidths.control`.
  - Remove the press scale.
  - Zero the inline padding of every `shape="square"` button.
  - Add `Clipboard` over `@zag-js/clipboard`: `Root`, `Trigger`, `Indicator`, `Label`, `Input`,
    `ValueText`, `Consumer`.
  - Breaking: `Clipboard.Root` takes no `translations`. `Clipboard.Trigger` takes `label` and
    `copiedLabel`.
  - Add `DownloadTrigger` and `download` over `@zag-js/file-utils`.
  - Add `ToggleGroup` over `@zag-js/toggle-group`, and depend on `component-layout`.
  - Add `Swap` with `motion`, `lazyMount` and `unmountOnExit`.
  - Add `ColorModeToggle`, and peer on `provider-color-mode`.
  - Add a specimen per component, with examples.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Emit every status value through `statusEmitted()` in `staticCss` of every recipe with a `status`
    axis.
- Updated dependencies [[`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`dece6ae`](https://github.com/stealth-scale/scale/commit/dece6ae8193e5204079c50c5a9311360243d3557), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-layout@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/provider-color-mode@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`c9f0233`](https://github.com/stealth-scale/config/commit/c9f0233e3357bed7c6161d6a7fd9a03fdab1da4e) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-actions: publish the button and the icon button
  
  - `Button` binds a `button` element through the compiler's factory with `type` defaulted to
    `button`, so a caller changes the element with `as`. `ButtonPropsProvider` sets the variants of
    every button below it.
  - The recipe offers the six looks and a glass look, the eight control sizes up to a hero's `4xl`,
    the four statuses, a square shape and the glow effect, each a layer style, a semantic scale step
    or a palette a theme moves.
  - A button takes an `elevation`, `raised` or `floating`, which lifts under a pointer and drops
    towards the page under a press, and a `ripple` beside the `glow`.
  - `IconButton` binds the same recipe with the square shape as its default, and its props require
    `aria-label` or `aria-labelledby`. A compound clears the inset a leading mark takes off it, so a
    square button holding one mark keeps the mark centred.
  - The preset under `./theme` registers the recipe.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
