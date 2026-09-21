# @stealthscale/vite-config-specimen

## 0.2.0

### Minor Changes

- [#40](https://github.com/stealth-scale/scale/pull/40) [`355143c`](https://github.com/stealth-scale/scale/commit/355143c45a249bf29019114371949136e08e6c13) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config-specimen: take the specimen globs on layers
  
  - `layers(files)` stops counting the files a package names, `**/*.specimen.tsx` by default. It is
    the one entry for a package that holds specimens, and `uncounted` is no longer exported.
  - The specimen glob and the renaming of a borrowed contribution are stated once, in `specimens.ts`,
    rather than in three files.

### Patch Changes

- Updated dependencies [[`b588ff3`](https://github.com/stealth-scale/scale/commit/b588ff39d85f40125c2665be19124d208d485ae9), [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4), [`832064c`](https://github.com/stealth-scale/scale/commit/832064cb73b2d437c496f551b26202ca96cdd954), [`e94c22a`](https://github.com/stealth-scale/scale/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192)]:
  - @stealthscale/vite-config@0.7.0
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
