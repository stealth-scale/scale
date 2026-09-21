# @stealthscale/vite-plugin-base

## 0.3.0

### Minor Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`ea7263b`](https://github.com/stealth-scale/scale/commit/ea7263ba8a41ef6bca751d5982194c6cec0824a7) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Add `withLock`, which holds a lock directory across processes with a recorded owner, a grace and a
  wait, and `scratchDir`, which names a plugin's scratch outside the workspace. Write a generated file
  through a staged rename, and stop a directory sync on a source that cannot be listed. Resolve an
  export map in Node's order, walk `node_modules` to a package's real directory, and key a lockfile by
  `name@version` with `installedOf` picking the record an installation matches. Cut a lockfile key at
  the first `@` past its opening character, so an alias and an address with a credential stay whole on
  the version's side.

- [#40](https://github.com/stealth-scale/scale/pull/40) [`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-base: add quoted
  
  - `quoted(text)` writes a string as a JavaScript string literal: JSON's escaping, plus the line and
    paragraph separators as unicode escapes, which JSON leaves bare and a code scanner reads as
    unsanitised code. `literal()` writes every string and key through it.

## 0.2.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-base: add the readers and writers a generating plugin needs
  
  - `locked` reads what the workspace lockfile pinned for each installed package, moved here from the
    sbom plugin with the `yaml` dependency.
  - `dependencies` walks every package reachable through `dependencies` from a manifest, each once,
    placed after what it depends on. `packageAt` resolves one package's directory from its dependent,
    and `resolvedOnGraph` resolves a package's entry from the root or from any package on the graph.
  - `exportTarget` reads the target an export map names for a subpath under a set of conditions.
  - `imported` loads a module through Vite under the application's export conditions, through a
    running dev server's runner where there is one, and lists the files behind it.
  - `literal` writes a value as the source that reproduces it, for a generated file.
  - `writeIfChanged` writes a generated file only when its content differs, and `emptyDir` clears a
    generated directory.

## 0.1.2

### Patch Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-plugin-base: pack under the shared plain configuration
  
  - The plugin is packed under `@stealthscale/vite-config-plain` rather than under a copy of the node
    tier.
  - `engines.node` is `>=26.0.0`.
  - `README.md` ships in the tarball, covering every export and the four kinds of module the crawl
    leaves out.
  - `description` is a sentence naming what the package does.

## 0.1.1

### Patch Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The readme installs with pnpm, which is what this repository is built and released under. No export
  changes.
