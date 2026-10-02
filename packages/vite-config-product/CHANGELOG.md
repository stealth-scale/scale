# @stealthscale/vite-config-product

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`f475e1d`](https://github.com/stealth-scale/scale/commit/f475e1dff027129a19a822df2db96fde54b60e60) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `layers()`, with the product plugin and the definition module's default export excused.
  - Add `composed()`, which appends the product plugin.
  - Add `lint.plugin.contract()`, which refuses a contract every import but `sdk-core`, other
    contracts, its own modules and a Standard Schema library.
  - Add `lint.plugin.web()`, which refuses `sdk-host` to a web package and a static import of a
    component module to its manifest entry.
  - Add `standalone()`, which serves a plugin's standalone page under `vp dev`.
  - Peer on `vite-config-theme`.

### Patch Changes

- Updated dependencies [[`b588ff3`](https://github.com/stealth-scale/scale/commit/b588ff39d85f40125c2665be19124d208d485ae9), [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4), [`ab77490`](https://github.com/stealth-scale/scale/commit/ab774905ada897d5d8912490a2e6a98294f31057), [`832064c`](https://github.com/stealth-scale/scale/commit/832064cb73b2d437c496f551b26202ca96cdd954), [`10e17cb`](https://github.com/stealth-scale/scale/commit/10e17cbabdb003f4b911834221df7bf04d975fe5), [`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca), [`a097939`](https://github.com/stealth-scale/scale/commit/a09793940f7ccc5fd616bcae8d965cb2b4239dc0), [`66e031c`](https://github.com/stealth-scale/scale/commit/66e031cf56a3f1eb88d5df515dd864ff97f210f9)]:
  - @stealthscale/vite-config@0.7.0
  - @stealthscale/vite-config-theme@0.2.0
  - @stealthscale/vite-plugin-product@0.2.0
