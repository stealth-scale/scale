# @stealthscale/vite-plugin-i18n

## 0.2.0

### Minor Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`2749d9e`](https://github.com/stealth-scale/scale/commit/2749d9e4987235f774e0b0ea41e0072bf2afb007) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - List the catalogue files each module read as files to watch, and a stamp the plugin rewrites when a
  language or a namespace appears or disappears, so a dev server that bundles and a watching build
  follow a change. Write the types again on an edit. Hand the catalogues module back for a reload when
  the set of languages and namespaces changes, and push the pair as before when only the words did.
  Close an empty loader table as an object, so a workspace with no catalogue gets a module that runs.

### Patch Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`1d8b3db`](https://github.com/stealth-scale/scale/commit/1d8b3dbf4c12930a065be4cfbaf4537a25d68900) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Write no loader for a language the catalogues module inlines. The runtime reads an inlined language
  from the bundle and never calls its loader, and the loader made the bundler write every pair of that
  language as a chunk beside the same words inlined.

- [#43](https://github.com/stealth-scale/scale/pull/43) [`bc7ff8d`](https://github.com/stealth-scale/scale/commit/bc7ff8defc92f0bdaa86cb3abb7f787a18f8a79b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Treat a package built or tested under its own root as a package: the keys its own catalogues add to
  a namespace another package ships are what it defines, not an application's typo. The root is the
  application where its manifest is private.
- Updated dependencies [[`ea7263b`](https://github.com/stealth-scale/scale/commit/ea7263ba8a41ef6bca751d5982194c6cec0824a7), [`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5)]:
  - @stealthscale/vite-plugin-base@0.3.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`94d816d`](https://github.com/stealth-scale/config/commit/94d816de13fcd4580f32abcae9f18d1cd01be603) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-i18n: find every catalogue an application can reach and type its keys
  
  - `i18n()` walks the dependency graph from the application root and reads every
    `locales/<language>/<namespace>.json` it finds, JSON or YAML. A package ships its catalogues
    beside its code and the application lists none of them.
  - The walk follows `dependencies` and `peerDependencies`, plus the application's own
    `devDependencies`. A component package declares its siblings as peers and an example declares what
    it demonstrates as a dev dependency, so a walk over runtime dependencies alone would find neither
    one's catalogue.
  - Only packages under the application's scope are followed. Following every dependency of a
    rendering engine would read hundreds of manifests and find no catalogue in any of them. `scopes`
    names others.
  - A namespace is the first path segment under the language. A directory splits one namespace across
    files, each nested under the path that leads to it, and the namespace is still fetched as one
    module.
  - Dependencies are read before the application, so the application wins any key two packages both
    declare.
  - `virtual:i18n` inlines the fallback language for the first paint and reaches every other language
    through a loader that imports one module per pair. Under `eager` every language is inlined and the
    loader fetches nothing.
  - `src/i18n.gen.d.ts` augments the foundation's `Resources` with every namespace, each string typed
    as the literal it is, so an unknown key and a dropped placeholder are both editor errors.
  - A build throws on a key the fallback does not define, on a placeholder a translation drops, and on
    one owner declaring a key in two files. A dev server reports the same three and keeps serving.
  - A plural form is checked against any form of the same key and may spell the count out, so
    `één pagina` passes against `{{count}} page`. Every other placeholder is still required.
  - On a dev server a catalogue change is sent to the page as an `i18n:catalogue` event carrying the
    pair merged afresh, and nothing reloads. A watching build has no page to send to and rebuilds the
    types instead.
