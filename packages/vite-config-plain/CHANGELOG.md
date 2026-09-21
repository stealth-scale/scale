# @stealthscale/vite-config-plain

## 0.2.1

### Patch Changes

- [#34](https://github.com/stealth-scale/scale/pull/34) [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - walk past the worktrees an agent session checks out
  
  `.claude` holds a worktree per session, each a second copy of the repository. A run from the root
  descended into them, counting every file twice and running every specification again: 2090 of 3016
  files in one root coverage report came from a worktree, which put the report at 32% against a
  threshold of 100%.
  
  The globs are anchored at the root: `.claude/**` for the test files, which the runner globs from the
  root, and `<root>/.claude/**` for coverage, which the provider matches anywhere in an absolute path.
  A run inside a worktree counts its own files again. With `**/.claude/**` it reported 0 of 0 lines at
  100% and passed the thresholds on nothing.

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
