# @stealthscale/component-feedback

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`85466a2`](https://github.com/stealth-scale/scale/commit/85466a26f86bfb00efc2695d7b57aaedb8c87b08) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Alert`: `Root`, `Indicator`, `Content`, `Title`, `Description`, `Aside`, `CloseTrigger`.
  - `Alert` axes: `status`, `variant`, `size`, `layout`, `radius`, `motion`, `edge`.
  - Add `live` to `Alert`: `assertive`, `polite` or `off`.
  - Render skeletons on the neutral fills, and stop their motion once loaded.
  - Size skeleton text bars to one line with a `0.5lh` gap.
  - Breaking: `EmptyState.Root` sizes are `sm`, `md` and `lg`.
  - Add `Spinner` with `size`, `palette`, `stroke`, `track` and `effect`.
  - Add `Loader` and `LoaderOverlay`.
  - Add `Progress` over `@zag-js/progress`, with `striped`, `animated` and indeterminate `null`.
  - Add `ProgressCircle`.
  - Add `Toast` over `@zag-js/toast`, with `createToaster` and `Region`.
  - Add `Meter` on `Progress`.
  - Add `Marker` and `Segment` to `Progress` and `Meter`.
  - Outline alerts and loading skeletons under forced colors.
  - Peer on `@stealthscale/hooks`.
  - Add a specimen per component, with examples.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Emit every status value through `statusEmitted()` in `staticCss` of every recipe with a `status`
    axis.
- Updated dependencies [[`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`8041d27`](https://github.com/stealth-scale/config/commit/8041d27526629165ca78a37751f77ec66ac4ec3c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-feedback: publish the skeleton and the empty state
  
  - `Skeleton` stands in for content that has not arrived. It wraps that content rather than replacing
    it, so the stand-in comes out the size of the thing it stands in for without anybody stating a
    width, and it hides everything inside it until the content fades in. It takes a motion and a
    corner, each an axis of its recipe.
  - Every motion reads an animation style the theme states, so a reader who asked for reduced motion
    is served once in the theme rather than in every recipe.
  - `SkeletonText` stands in for a paragraph. A bar is one line tall and the space between two is half
    a line, both read off the line the bars stand in for, so a paragraph of stand-ins occupies what
    the real paragraph will and the page does not jump. The last bar of several is short.
  - `EmptyState` draws the panel a page shows where there is nothing to show, composed as
    `EmptyState.Root` holding a mark, a heading and a line saying what would be here. One size axis
    moves the room inside the panel, the gap in the content, the box of the mark and the size of the
    title together.
  - Neither the skeleton nor the panel carries a role. A page states `aria-busy` on whatever is
    waiting, which is one announcement rather than one per bar, and a page of empty panels is not a
    page of landmarks.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
