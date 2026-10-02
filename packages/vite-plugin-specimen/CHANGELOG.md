# @stealthscale/vite-plugin-specimen

## 0.2.0

### Minor Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`ee9bec3`](https://github.com/stealth-scale/scale/commit/ee9bec31de357f6b26e79e755b6c2ee86159102e) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Regenerate the index when a specimen is added, removed or changes its metadata.
  - Import the compiler's type through the types module.

- [#43](https://github.com/stealth-scale/scale/pull/43) [`c578d12`](https://github.com/stealth-scale/scale/commit/c578d12f4f26dbedd2b60f4bada00f4f4458ebf1) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Write every page into one `pages` chunk and every page's props into one `props` chunk.

- [#34](https://github.com/stealth-scale/scale/pull/34) [`e94c22a`](https://github.com/stealth-scale/scale/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Classify a property declared by a runtime dependency as an option.
  - Add `Indexed.namespace`.
  - Breaking: remove `virtual:specimen-fragments/<id>`, `Fragments`, `Indexed.fragments` and
    `Indexed.source`.
  - Give every specimen its own hot update boundary, which dispatches `specimen:updated`.
  - Name a page's chunk and its props chunk after the page.
  - Write `Indexed.path` relative to the root.
  - Write strings in generated modules through `quoted()`.
  - Include a page chunk's dependencies recursively.
  - Export `source` from every `*.example.tsx`.
  - Read a factory's `*Props` type as a part.
  - Read each module a specimen and its examples import once.
  - Classify each declaration's file once per package.
  - Read a package's dependencies once per compiler.
  - Ask the compiler for no call signatures of literal and intrinsic types.
  - Read every page in one program for each set of compiler options.
  - Keep each page's props on disk under Vite's `cacheDir`, keyed by the page's package, the workspace
    packages it builds on, the lockfile and the reader.
  - Stop the compiler a minute after a dev server's last read.
  - Keep the part of the module beside the specimen where two modules export one name.
  - Leave a class's private members out of `shapes`.
  - Peer on `vite` 8.3.

### Patch Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`0324a1c`](https://github.com/stealth-scale/scale/commit/0324a1ce2c511a04ae16dbe027d1d06d90e04921) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Write the `pages` and `props` chunks in a build only, not under a dev server.
- Updated dependencies [[`ea7263b`](https://github.com/stealth-scale/scale/commit/ea7263ba8a41ef6bca751d5982194c6cec0824a7), [`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5)]:
  - @stealthscale/vite-plugin-base@0.3.0

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`578a9bb`](https://github.com/stealth-scale/config/commit/578a9bb016cb3e7e6f33c043d1360839e9a55f11) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - resolve what a page's components accept out of their types
  
  - `props` on the options serves `virtual:specimen-props/<id>`, which maps every part onto the props
    it takes, the named types those refer to, and what was dropped.
  - Classify a property by every declaration behind it rather than the first, which keeps `gap` on a
    list and `aria-label` on an icon button where the style props and the rendering library share
    those names.
  - Drop a property with no declaration at all, which is what a styling condition resolves to, so no
    pattern names the conditions.
  - Read a recipe file for a variant and the component's own package for an option, both through the
    compiler's own metadata for where a file sits, so a repository states no path.
  - Report the dropped counts rather than hiding them. A button resolves to 1341 properties, six of
    which are its own.
  - Expand a union written under a name into its options, so `size: Scale` reads as its eight steps.
  - Skip a type from TypeScript's own libraries.
  - `typescript` is an optional peer, loaded on the first page that carries props.
  
  218 tests, 100% on all four metrics.

- [#29](https://github.com/stealth-scale/config/pull/29) [`c68ac09`](https://github.com/stealth-scale/config/commit/c68ac0960da80e74da7e7444c4b9e89d6380eba2) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - add the specimen index plugin
  
  - Parse `id`, `group`, `title` and `about` out of a specimen's default export.
  - Serve `virtual:specimen-index` as one listing per file with a dynamic import per page, and
    `virtual:specimen-fragments/<id>` as one snippet per scene.
  - Serve both without a source map, which was four fifths of the payload.
  - List a file that declares no page with the reason as its opening and a rejecting loader, and throw
    on a build instead.
  - Refuse the second of two files declaring one identifier and name the first.
  - Reload the index when a page appears, disappears, or changes its metadata, and leave it alone when
    an edit changes only a scene.
  
  138 tests, 100% on all four metrics.
