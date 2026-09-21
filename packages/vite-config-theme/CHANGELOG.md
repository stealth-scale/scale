# @stealthscale/vite-config-theme

## 0.2.0

### Minor Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Load the theme plugin when a plugin is constructed rather than when the layer is stated. State the
  packer's runtime plugin as an override that hands it the conditions the presets resolved with, so a
  pack of a checkout nothing generated in generates the runtime from the preset's source before it
  resolves an import. Drop the cache layer: the plugin keeps its scratch outside the workspace now.

### Patch Changes

- Updated dependencies [[`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca), [`66681c2`](https://github.com/stealth-scale/scale/commit/66681c2fa7e2c8a98a41090d225423ee0c8b04cb), [`35ed1e2`](https://github.com/stealth-scale/scale/commit/35ed1e20a3ba344ad15a13b716123b04f6db88d6)]:
  - @stealthscale/vite-config-core@0.4.0
  - @stealthscale/vite-plugin-theme@0.2.0

## 0.1.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`6299362`](https://github.com/stealth-scale/config/commit/6299362c1f82969a33049d451ee88bdd6a10526f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config-theme: add the runtime and stylesheet contributions
  
  - `runtime()` adds `theme.runtime()` to the plugins of the design-system package, and `stylesheet()`
    adds `theme.stylesheet()` to the plugins of an application.
  - `layers()` and `workspace()` contribute nothing, so every package lists every add-on the same way.

### Patch Changes

- Updated dependencies [[`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354)]:
  - @stealthscale/vite-plugin-theme@0.1.0
