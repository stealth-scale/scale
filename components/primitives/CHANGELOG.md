# @stealthscale/component-primitives

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `ScrollArea` over `@zag-js/scroll-area`: `Root`, `Viewport`, `Content`, `Scrollbar`, `Thumb`,
    `Corner`.
  - Axes: `variant`, `size`, `scrolls`, `inset`, `fade`, `maxHeight`.
  - Make the viewport a focusable `region` while it overflows, and add `focusable={false}` and
    `focusable="none"`.
  - Measure overflow before the first paint.
  - Add `--scroll-area-ring-offset` and `--scroll-area-ring-style` for composing recipes.
  - Publish the preset under `./theme`.
  - Add a specimen per component.

### Patch Changes

- Updated dependencies [[`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`a40abdd`](https://github.com/stealth-scale/config/commit/a40abdd40b847dcafd687eeb83a4a286d07ee88d) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-primitives: publish the portal
  
  - `Portal` draws what it holds at the document's body, or at a `container` a caller names, so a box
    positioned against the viewport is not clipped or stacked by the page it was written in. A caller
    who wants the content where it was written passes `disabled` rather than leaving the portal out.
  - The portal draws nothing until it has mounted, so a page rendered to a string carries no portalled
    content and the first client render matches it.
