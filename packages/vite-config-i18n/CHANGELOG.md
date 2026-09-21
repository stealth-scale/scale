# @stealthscale/vite-config-i18n

## 0.1.1

### Patch Changes

- [#34](https://github.com/stealth-scale/scale/pull/34) [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - find the setup file before the foundation has been built
  
  `worded` resolved `@stealthscale/provider-i18n/testing` at module scope, which is built output. The
  runner loads every package's configuration to assemble its task graph, and that happens before
  anything has been built, so the first package to call `i18n.layers()` failed the whole graph rather
  than one build.
  
  The manifest is resolved instead, which a workspace holds whatever it has built. A workspace then
  answers with the source and an installed copy, which publishes no source, answers with the built
  file.
- Updated dependencies []:
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/vite-plugin-i18n@0.1.1

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
