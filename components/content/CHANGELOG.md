# @stealthscale/component-content

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`2e97f7e`](https://github.com/stealth-scale/scale/commit/2e97f7e8fd2064f07370a9dd06fe86d8e80ad7e8) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `CodeBlock` over `@tanstack/highlight`: `Root`, `Header`, `Title`, `Control`, `Content`,
    `Code`, `Copy`, with `size` and `mode`.
  - Breaking: `CodeBlock.Copy` takes `label` and `copiedLabel` in place of `translations`.
  - Scroll `CodeBlock.Content` in `ScrollArea`, named by the title or `label`.
  - Breaking: `CodeBlock.Content` takes no `as`, and `CodeBlock.Title` takes no `id`.
  - Add `before`, `CodeBlock.Diff` and `CodeBlock.DiffStat` over `diff` 9.0.0.
  - Render terminal output for `language="ansi"`, and copy it without escapes.
  - Add `CodeBlock.parseAnsi` and `CodeBlock.stripAnsi`.
  - Add a `wrap` axis to `CodeBlock`.
  - Add `JsonTreeView` over `@zag-js/json-tree-utils` and the collections `TreeView`.
  - Add `Marquee` over `@zag-js/marquee` with `PauseTrigger`, `PauseIndicator` and `gap`.
  - Add `Markdown` over `@tanstack/markdown` 0.0.15, rendered with the library's components.
  - Mark a `streaming` Markdown document `aria-busy` and render a caret.
  - Depend on `component-actions` and `component-collections`, and peer on `component-primitives`.
  - Add a specimen per component.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.
- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204), [`85466a2`](https://github.com/stealth-scale/scale/commit/85466a26f86bfb00efc2695d7b57aaedb8c87b08), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`d577ce3`](https://github.com/stealth-scale/scale/commit/d577ce3a013b0af1f6cd2dce358f496382a58616), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-collections@0.1.0
  - @stealthscale/component-feedback@0.2.0
  - @stealthscale/component-navigation@0.2.0
  - @stealthscale/component-a11y@0.1.1
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-layout@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/component-typography@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
