# @stealthscale/vite-config-core

## 0.4.0

### Minor Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Read only `STEALTH_*`, `VITE_*`, `CI`, `CI_COMMIT_SHA` and `GITHUB_SHA` from the environment.
  - Skip `plugins` contributions while resolving metadata, and keep `pack.plugins`.
  - Export `resolvingMetadata`, `appended` and `located`.
  - Resolve a plugin package from the module that names it through `located`.
  - Peer on `vite` 8.3 and `vitest` 5.0.

## 0.3.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-config-core: add named(), and import vite
  
  - `named(name, layer)` returns the same layer under another name. A factory that builds its layer
    from another factory uses it to name the result for its own call.
  - The kernel imports `vite` and peers on `vite` from the peer catalog. `vite-plus` is not a peer.
  - The kernel is packed under `@stealthscale/vite-config-plain` rather than under a copy of the node
    tier.
  - `engines.node` is `>=26.0.0`.
  - `README.md` ships in the tarball, covering every export, the fields each kind of layer states, and
    the order a configuration settles in.
  - `description` is a sentence naming what the package does.

## 0.2.1

### Patch Changes

- [`057f3d3`](https://github.com/stealth-scale/config/commit/057f3d3b9cc405e60b78bfa5e0e3fe3d81f8d34b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The root's configuration answers for the root when read from a package that states a configuration
  of its own. `vp check` and `vp lint` read it from wherever they run, and a root tier that packs was
  reading the package's manifest instead, refusing an application for publishing nothing.

## 0.2.0

### Minor Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Find the workspace root under pnpm, which states its directories in `pnpm-workspace.yaml` rather
  than in the manifest. Without that, `context.root` fell back to the package being configured and
  `context.manifest.workspaces` was undefined throughout a pnpm repository, so any layer telling a
  root apart from a package read the wrong answer. npm, bun and yarn are unchanged, and a repository
  stating a workspace in both places is still answered from the manifest.
