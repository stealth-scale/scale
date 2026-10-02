# @stealthscale/specimen

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`32dbbac`](https://github.com/stealth-scale/scale/commit/32dbbac565565f55a04573e8260d06dc361de08f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Sample`, one captioned drawing of a component.
  - Add `Board`, samples on the library's grid.
  - Lay a one-axis matrix on equal grid columns.
  - Add `frame` to `Scene`: `inset`, `bleed` or `bare`.
  - Move captions from the matrix to the sample.
  - Use `CodeBlock.Copy` in the catalogue's passages.

- [#43](https://github.com/stealth-scale/scale/pull/43) [`fefde06`](https://github.com/stealth-scale/scale/commit/fefde0656383e78cf1c0341d16c5ce5267accd35) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Show why a page or its props failed to load, with a reload button.
  - Return the load failure from `useDeclared` and `useAnatomy`.
  - Read a framed document's report only from a same-origin frame.
  - Publish the `locales` directory.

- [#34](https://github.com/stealth-scale/scale/pull/34) [`6990b94`](https://github.com/stealth-scale/scale/commit/6990b94cfcab5367951c5feb18e59104cfcd5051) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Rail` and `Page`, which render the pages a build indexed.
  - Add `grouped`, `declared` and `parted`.
  - Take the pages as a prop instead of reading `virtual:specimen-index`.
  - Read the catalogue's words from the `specimen` namespace in `locales/en/specimen.json`.
  - Peer on `@stealthscale/provider-i18n` and `@stealthscale/vite-plugin-specimen`.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`1176fe2`](https://github.com/stealth-scale/scale/commit/1176fe27be6ce534199ff09ae00da44157f22524) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Render a scene in a `Device` frame when the viewport states a width.
  - Add `Pane` and `viewport: true` on a scene.
  - Add per-axis pickers in a device.
  - Add `Placing.framed` and `framedDeclaration`.
  - Add `PHONE`, `widthsOf` and `deviceOf`.
  - Breaking: remove `Stage` and `stageWidthOf`.
  - Redraw a page in place on a specimen save through `specimen:updated`.
  - Peer on `component-disclosure` and `provider-viewport`, depend on `lucide-react`.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`3385a3c`](https://github.com/stealth-scale/scale/commit/3385a3c8d3d1f1c19affe900b6e046ca22c1619f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - `declarations` takes a `Placing` and returns the catalogue route, its index and one page per
    entry.
  - Add `indexId` and `Index`, a section per group with a card per page.
  - Add `Placing.beside` for pages an application writes.
  - Render `Rail` as one `Sidebar.Nav` with a `NavList` branch per group.
  - Render `Page` with a `Page.Header` and a `Section` per scene.
  - Add `about` to an entry.
  - Peer on `component-navigation`, `component-screen` and `component-surfaces`, not
    `component-actions`.

- [#40](https://github.com/stealth-scale/scale/pull/40) [`14fe3ba`](https://github.com/stealth-scale/scale/commit/14fe3ba9bd2d3975bd0095dcecdd6040669d2bdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Load axe on the first audit instead of in the entry chunk.
  - Add `Placing.audit` and `Placing.heights`.
  - Add `shortcut` to `RailSearch`.
  - Read the catalogue's own words from `useWords()` without a prefix.
  - Fix `PropsType` matching a type name inside a longer identifier.
  - Fix the audit control ignoring every second press.
  - Fix the device frame ignoring the router's base.
  - Fix `useReportedChoices` and `useUpdated` running on every render.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`7f1cd6f`](https://github.com/stealth-scale/scale/commit/7f1cd6fca257450e70aeacfeed0e4b817a748940) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Room`, a box at one of the page's measures, `sm` by default.
  - Return the size axis from `valuesOf` in the scale's order.

- [#34](https://github.com/stealth-scale/scale/pull/34) [`447426a`](https://github.com/stealth-scale/scale/commit/447426a6f4806535a258a70d608c5bc12c7ac441) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `declarations`, one route per indexed page without a leading slash.
  - List the rail from declarations.
  - Add `Entry` and `entryOf`.
  - Add `grouped`, which returns the rail's sorted tree.
  - Add `routeId`.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`602e961`](https://github.com/stealth-scale/scale/commit/602e96102361e56695ecdb16f4880feaa2d289e5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Size matrix columns as `minmax(min-content, 1fr)`.
  - Stretch matrix cells to their columns.
  - Give matrix rows a larger gap than cells.
  - Fit board columns to their samples.
  - Add `place="start"` to the sample axis.

- [#41](https://github.com/stealth-scale/scale/pull/41) [`83359f1`](https://github.com/stealth-scale/scale/commit/83359f1b2738a6872e410040c0e98ba03b4763e3) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `scenesOf(recipe, options)`, one scene per axis.
  - Add `uncovered` and `stale`.
  - Add `written`, `propped` and `sourceOf`.
  - Add `Scene.axes`, `Scene.source`, `Scene.example` and `Scene.props`.
  - Add `Specimen.imports`.
  - Breaking: remove `Fragments`, `useLoadedPage` and `Loaded`.
  - Name the parts in the props table after the page ID with `namespaceOf(id)`.
  - Add `variant="inverted"` to `Sample`, and `grounded`.
  - Add `Contained`, `Focused` and `Screen`.
  - Turn off the landmark placement rules in a scene audit.
  - Render `Rail` as one `Sidebar.Nav` per section with `Sidebar.Empty`.
  - Breaking: `Rail` takes no `query`.
  - Breaking: `RailSearch` takes no `value`, `onValueChange` or `panel`, and `shortcut` is a key.
  - Order `2xs` before `xs` in `valuesOf`.
  - Scroll a two-axis `Matrix` and a device stage in `ScrollArea`.
  - Set `iframes: false` in `RULES`.
  - Title the charts, media, graphs and tables groups.
  - Peer on `@stealthscale/component-primitives`.

### Patch Changes

- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204), [`2e97f7e`](https://github.com/stealth-scale/scale/commit/2e97f7e8fd2064f07370a9dd06fe86d8e80ad7e8), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`18e2d59`](https://github.com/stealth-scale/scale/commit/18e2d59bc110b9ab7f8f945e9ecc2a0bb1b48531), [`d577ce3`](https://github.com/stealth-scale/scale/commit/d577ce3a013b0af1f6cd2dce358f496382a58616), [`9c2af0c`](https://github.com/stealth-scale/scale/commit/9c2af0cbd07058744c266740ee1188f46eaa6a3f), [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`0324a1c`](https://github.com/stealth-scale/scale/commit/0324a1ce2c511a04ae16dbe027d1d06d90e04921), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34), [`ee9bec3`](https://github.com/stealth-scale/scale/commit/ee9bec31de357f6b26e79e755b6c2ee86159102e), [`c578d12`](https://github.com/stealth-scale/scale/commit/c578d12f4f26dbedd2b60f4bada00f4f4458ebf1), [`e94c22a`](https://github.com/stealth-scale/scale/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192)]:
  - @stealthscale/component-collections@0.1.0
  - @stealthscale/component-content@0.1.0
  - @stealthscale/component-data@0.2.0
  - @stealthscale/component-disclosure@0.2.0
  - @stealthscale/component-navigation@0.2.0
  - @stealthscale/component-screen@0.1.0
  - @stealthscale/component-surfaces@0.1.0
  - @stealthscale/component-a11y@0.1.1
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-layout@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/component-typography@0.2.0
  - @stealthscale/provider-router@0.2.0
  - @stealthscale/provider-viewport@0.2.0
  - @stealthscale/vite-plugin-specimen@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/provider-i18n@0.1.0

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`dd8f5e8`](https://github.com/stealth-scale/config/commit/dd8f5e823522d0becdd3218f1a2076fa6ad696d4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - add what a specimen is written with
  
  - `specimen()` and `scene()` declare a page and the things drawn on it. The index plugin parses the
    call out of the source and never evaluates it.
  - `Matrix` draws one captioned cell per value of an axis, with `of`, `knob` and `label` describing
    the axis and `direction` the arrangement.
  - Draw the arrangement as `Stack` and the caption as `Text`, so the package states no recipe and
    registers no preset.
  - Write both arrangements out rather than forwarding `direction` to one stack, because the compiler
    extracts a JSX literal and not a value read from a prop.
  
  27 tests, 100% on all four metrics.
