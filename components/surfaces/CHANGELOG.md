# @stealthscale/component-surfaces

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`18e2d59`](https://github.com/stealth-scale/scale/commit/18e2d59bc110b9ab7f8f945e9ecc2a0bb1b48531) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Card`: `Root`, `Media`, `Header`, `Indicator`, `Title`, `Description`, `Aside`, `Content`,
    `Footer`, `Section`, `Overlay`.
  - `Card` axes: `variant` (`elevated`, `outline`, `subtle`, `glass`, `plain`), `size`, `orientation`,
    `radius`, `justify`, `palette`, `motion`, `divided`, `interactive`, `effect`, `scrim`, `disabled`.
  - Stretch the title's link over an interactive card, and ring the card when the link has focus.
  - Breaking: `palette` replaces `status`.
  - Breaking: remove `backdrop`.
  - Color a toned card's edge with `colorPalette.muted`.
  - Rule bands with `borderWidths.hairline` across the card's full width.
  - Add a specimen per component.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Emit every status value through `statusEmitted()` in `staticCss` of every recipe with a `status`
    axis.
- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
