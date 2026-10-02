# @stealthscale/vite-plugin-product

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`66e031c`](https://github.com/stealth-scale/scale/commit/66e031cf56a3f1eb88d5df515dd864ff97f210f9) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `product()`, which composes a product from its definition while it builds.
  - Find each installed plugin's web package and contract package among the modules the definition
    loaded.
  - Count the product's own package among its dependencies.
  - Assign a manifest no loaded module exports to the package of the definition module.
  - Add the `standalone` option, which writes a plugin's standalone definition and serves its page.
  - Check every key against the words `vite-plugin-i18n` found, and each command's keys with
    `@tanstack/hotkeys`.
  - Serve `virtual:product`, and declare it in `@stealthscale/vite-plugin-product/client`.
  - Fail a build on a problem, and print each warning.
  - Build each plugin's lazy modules into a chunk named `plugin-<id>`.
  - Write `.product/access.json`, `.product/flags.json` and `.product/operations.json` in a client
    build.
  - Compose the product again after a change, then reload the page or show the problems in the error
    overlay.
  - Run one composition at a time after changes, and skip a change that a later change superseded.
  - Compose through one environment, and transform only the changed files before composing again.
  - Depend on `@tanstack/hotkeys` 0.10.0.

### Patch Changes

- Updated dependencies [[`61bde17`](https://github.com/stealth-scale/scale/commit/61bde17f9d1b3605d50885cf30b1ca0cde267406), [`ea7263b`](https://github.com/stealth-scale/scale/commit/ea7263ba8a41ef6bca751d5982194c6cec0824a7), [`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5), [`1d8b3db`](https://github.com/stealth-scale/scale/commit/1d8b3dbf4c12930a065be4cfbaf4537a25d68900), [`bc7ff8d`](https://github.com/stealth-scale/scale/commit/bc7ff8defc92f0bdaa86cb3abb7f787a18f8a79b), [`2749d9e`](https://github.com/stealth-scale/scale/commit/2749d9e4987235f774e0b0ea41e0072bf2afb007)]:
  - @stealthscale/sdk-core@0.2.0
  - @stealthscale/vite-plugin-base@0.3.0
  - @stealthscale/vite-plugin-i18n@0.2.0
