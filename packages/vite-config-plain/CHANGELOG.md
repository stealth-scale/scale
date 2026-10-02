# @stealthscale/vite-config-plain

## 0.2.1

### Patch Changes

- [#34](https://github.com/stealth-scale/scale/pull/34) [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Exclude `.claude/**` worktrees from test and coverage globs, anchored at the root.

- [#43](https://github.com/stealth-scale/scale/pull/43) [`ab77490`](https://github.com/stealth-scale/scale/commit/ab774905ada897d5d8912490a2e6a98294f31057) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Set the packer's platform to `node`, as the node tier does.
  - Exclude the root's scratch directory from the specification glob.
  - Peer on `vite` 8.3 and `vitest` 5.0.

## 0.2.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`0329828`](https://github.com/stealth-scale/config/commit/032982862d632ccab5fc0478469056c13bf0c3e3) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-config-plain: publish the configuration the kernel and the plugins are packed under
  
  - `plain` is one `UserConfig` with the `pack`, `resolve`, `ssr` and `test` blocks the node tier
    states.
  - `vite-config-core`, `vite-plugin-base` and `vite-plugin-sbom` import it. Each carried a copy
    before.
  - `README.md` ships in the tarball, covering the four blocks `plain` sets and the two the node tier
    adds on top of them.
  - `description` is a sentence naming what the package does.
