# @stealthscale/component-data

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Status`: `Root`, `Indicator`, with `palette`, `size` and `effect`.
  - Add `Stat`: `Root`, `Label`, `ValueText`, `ValueUnit`, `HelpText`, `Indicator`.
  - Add `Tag`: `Root`, `Label`, `StartElement`, `EndElement`, `CloseTrigger`.
  - Add `ColorSwatch` and `ColorSwatchMix`.
  - Add `Timer` over `@zag-js/timer`.
  - Add `QrCode` over `@zag-js/qr-code`.
  - Add `Format.Number` and `Format.Byte` over `@zag-js/i18n-utils`.
  - Add `Timestamp`.
  - Breaking: `Badge` takes `palette` in place of `status`.
  - Breaking: `Badge` sizes are `sm`, `md`, `lg` and `xl`.
  - Add `effect` to `Badge`.
  - Peer on `@stealthscale/hooks` and `@stealthscale/provider-locale`.
  - Add a specimen per component, with examples.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Emit every status value through `statusEmitted()` in `staticCss` of every recipe with a `status`
    axis.
- Updated dependencies [[`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/provider-locale@0.1.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`9079091`](https://github.com/stealth-scale/config/commit/9079091cf23b5f22dcbeab2d321538830e7f67a5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-data: publish the badge
  
  - `Badge` labels something with one short word or a count, set off from what it labels. It takes a
    look, a size, a status and a corner, each an axis of its recipe, and `BadgePropsProvider` sets
    them for every badge below it.
  - Each look writes a background and an ink and nothing a pointer changes. A badge inside a row that
    hovers is crossed by the pointer whenever the row is, and one drawn in a fill would repaint there,
    which reads as a control a reader can press and then cannot.
  - The sizes read the semantic tag scale, so a badge is half the height of the control of its own
    size and its inset, its gap and its label come one step down. A medium badge beside a medium
    button reads at the small label.
  - The element is `span` and carries no role, so a screen reader reads its text and nothing else. A
    badge whose meaning is in its colour states that meaning with `aria-label`.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
