# @stealthscale/vite-plugin-sbom

## 0.3.2

### Patch Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`66b780d`](https://github.com/stealth-scale/scale/commit/66b780d8f4ede66cee40e3b0130bf6bcf2177171) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Match each reached package to the lockfile by its name and the version its manifest states, so two
  installed versions of one name each carry their own digest and source. Write a source URL without
  the credential in front of its host and without its query, keeping the fragment that names a commit.
- Updated dependencies [[`ea7263b`](https://github.com/stealth-scale/scale/commit/ea7263ba8a41ef6bca751d5982194c6cec0824a7), [`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5)]:
  - @stealthscale/vite-plugin-base@0.3.0

## 0.3.1

### Patch Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-sbom: read the lockfile through the base plugin
  
  - `locked` and `Installed` come from `@stealthscale/vite-plugin-base`, and the direct dependency on
    `yaml` goes with them.
- Updated dependencies [[`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354)]:
  - @stealthscale/vite-plugin-base@0.2.0

## 0.3.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-plugin-sbom: rename the options record to Described
  
  - `Described` replaces `Stated` as the name of the options record. `@stealthscale/vite-plugin-base`
    also exports a `Stated`, and two imports of one name meant two things.
  - The plugin is packed under `@stealthscale/vite-config-plain` rather than under a copy of the node
    tier.
  - `engines.node` is `>=26.0.0`.
  - `README.md` ships in the tarball, listing every `Described` and `Supplier` field against its
    default, and what the document records.
  - `description` is a sentence naming what the package does.

### Patch Changes

- Updated dependencies [[`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257)]:
  - @stealthscale/vite-plugin-base@0.1.2

## 0.2.0

### Minor Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Read `pnpm-lock.yaml`. A lockfile is the only place recording the integrity of what was installed
  and which registry it came from, so a bill of materials built in a pnpm repository listed every
  component without a hash and without a purl qualifier. Every document in the file is read, since
  pnpm writes the build it installed itself with ahead of a `---`. Adds `yaml` as a dependency.

### Patch Changes

- Updated dependencies [[`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b)]:
  - @stealthscale/vite-plugin-base@0.1.1
