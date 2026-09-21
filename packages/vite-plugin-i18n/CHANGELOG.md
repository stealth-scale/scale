# @stealthscale/vite-plugin-i18n

## 0.1.1

### Patch Changes

- Updated dependencies [[`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5)]:
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
