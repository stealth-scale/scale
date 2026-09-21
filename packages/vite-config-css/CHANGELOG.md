# @stealthscale/vite-config-css

## 0.2.1

### Patch Changes

- Updated dependencies [[`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca)]:
  - @stealthscale/vite-config-core@0.4.0

## 0.2.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-config-css: export layers(), workspace() and warn(), and name every layer for its call
  
  - `layers()` replaces `plugin.check()`. A package extends a tier from `@stealthscale/vite-config`
    and adds `css.layers()` beside it.
  - `workspace()` returns an empty array, so a root's config has the same shape whichever add-ons it
    lists.
  - `warn({ because, ...checked })` replaces `override.warn(checked)`. The `override` namespace is
    removed.
  - `peerDependencies` names `vite` from the peer catalog. `vite-plus` is not a peer.
  - `engines.node` is `>=26.0.0`.
  - `README.md` ships in the tarball, covering the three exports, the `Checked` fields and every rule
    the four sets declare.
  - `description` is a sentence naming what the package does.
  
  | Before            | After       |
  | ----------------- | ----------- |
  | `stylelint.check` | `css.check` |
  | `stylelint.warn`  | `css.warn`  |

### Patch Changes

- Updated dependencies [[`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257)]:
  - @stealthscale/vite-config-core@0.3.0

## 0.1.1

### Patch Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The readme installs with pnpm, which is what this repository is built and released under. No rule
  set and no export changes.
- Updated dependencies [[`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b)]:
  - @stealthscale/vite-config-core@0.2.0
