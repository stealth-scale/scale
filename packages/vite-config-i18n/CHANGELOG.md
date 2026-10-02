# @stealthscale/vite-config-i18n

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`9d2dd1b`](https://github.com/stealth-scale/scale/commit/9d2dd1b6a573174fca3711d63465dbdd0605fc0f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Peer on `vite` 8.3 and `vitest` 5.0.

### Patch Changes

- [#34](https://github.com/stealth-scale/scale/pull/34) [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Resolve the `provider-i18n` test setup file through its manifest, before anything is built.

- [#43](https://github.com/stealth-scale/scale/pull/43) [`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Load the catalogue plugin when the plugin is constructed, not when the layer is stated.
- Updated dependencies [[`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca), [`1d8b3db`](https://github.com/stealth-scale/scale/commit/1d8b3dbf4c12930a065be4cfbaf4537a25d68900), [`bc7ff8d`](https://github.com/stealth-scale/scale/commit/bc7ff8defc92f0bdaa86cb3abb7f787a18f8a79b), [`2749d9e`](https://github.com/stealth-scale/scale/commit/2749d9e4987235f774e0b0ea41e0072bf2afb007)]:
  - @stealthscale/vite-config-core@0.4.0
  - @stealthscale/vite-plugin-i18n@0.2.0
  - @stealthscale/provider-i18n@0.1.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`63e283b`](https://github.com/stealth-scale/config/commit/63e283b1c46de62c967ecb4a480a60478705cb47) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config-i18n: configure a package that ships catalogues
  
  - `catalogued()` appends the catalogue plugin to `plugins`, and every plugin option passes through.
  - `worded()` appends the foundation's setup file to `test.setupFiles`.
  - `layers()` returns both, for a tier to extend with. It returns a list rather than a tier, because
    a library and an application both ship catalogues and each picks its own tier.

### Patch Changes

- Updated dependencies [[`83f3481`](https://github.com/stealth-scale/config/commit/83f34814305877c1b60fa3a06ccfd1644c159615), [`94d816d`](https://github.com/stealth-scale/config/commit/94d816de13fcd4580f32abcae9f18d1cd01be603)]:
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/vite-plugin-i18n@0.1.0
