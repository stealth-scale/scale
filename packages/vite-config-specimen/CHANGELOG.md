# @stealthscale/vite-config-specimen

## 0.2.0

### Minor Changes

- [#40](https://github.com/stealth-scale/scale/pull/40) [`355143c`](https://github.com/stealth-scale/scale/commit/355143c45a249bf29019114371949136e08e6c13) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config-specimen: take the specimen globs on layers
  
  - `layers(files)` stops counting the files a package names, `**/*.specimen.tsx` by default. It is
    the one entry for a package that holds specimens, and `uncounted` is no longer exported.
  - The specimen glob and the renaming of a borrowed contribution are stated once, in `specimens.ts`,
    rather than in three files.

### Patch Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Load the specimen plugin when the plugin is constructed rather than when the layer is stated, from
  the module that names it, so reading a configuration for its metadata loads no plugin and a checkout
  whose tooling is not built yet can still plan its build.
- Updated dependencies [[`b588ff3`](https://github.com/stealth-scale/scale/commit/b588ff39d85f40125c2665be19124d208d485ae9), [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4), [`ab77490`](https://github.com/stealth-scale/scale/commit/ab774905ada897d5d8912490a2e6a98294f31057), [`832064c`](https://github.com/stealth-scale/scale/commit/832064cb73b2d437c496f551b26202ca96cdd954), [`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca), [`10e17cb`](https://github.com/stealth-scale/scale/commit/10e17cbabdb003f4b911834221df7bf04d975fe5), [`ee9bec3`](https://github.com/stealth-scale/scale/commit/ee9bec31de357f6b26e79e755b6c2ee86159102e), [`c578d12`](https://github.com/stealth-scale/scale/commit/c578d12f4f26dbedd2b60f4bada00f4f4458ebf1), [`e94c22a`](https://github.com/stealth-scale/scale/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192)]:
  - @stealthscale/vite-config@0.7.0
  - @stealthscale/vite-config-core@0.4.0
  - @stealthscale/vite-plugin-specimen@0.2.0

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`61d4586`](https://github.com/stealth-scale/config/commit/61d4586ec9b4aab760123ecd13d9e5ed8dbc67ff) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - exclude specimens from package coverage
  
  - `uncounted(files)` contributes `test.omit` for `**/*.specimen.tsx`.
  - `layers()` carries that omission and is the call a package holding specimens makes.
  - `catalogue(options)` is the call an application showing a catalogue makes, and carries what
    `layers(options)` carried.
  - `workspace(files)` carries the omission as well, because the root run counts every package's files
    and reads the root's configuration for what to leave out.

### Patch Changes

- Updated dependencies [[`578a9bb`](https://github.com/stealth-scale/config/commit/578a9bb016cb3e7e6f33c043d1360839e9a55f11), [`c68ac09`](https://github.com/stealth-scale/config/commit/c68ac0960da80e74da7e7444c4b9e89d6380eba2)]:
  - @stealthscale/vite-plugin-specimen@0.1.0
