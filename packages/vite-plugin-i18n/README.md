# @stealthscale/vite-plugin-i18n

`@stealthscale/vite-plugin-i18n` finds every catalogue an application can reach, types their keys,
and serves the module it loads them from. A package keeps its words beside its code and ships them.
The application reaches every catalogue without listing one.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-i18n
```

The package peers on `vite` and `@stealthscale/vite-plugin-base`. Most repositories reach it through
`@stealthscale/vite-config-i18n` rather than adding it by hand.

```ts
import { i18n } from "@stealthscale/vite-plugin-i18n";

export default defineConfig({ plugins: [i18n()] });
```

## Catalogue layout

A package keeps its catalogues under `locales/<language>/<namespace>.json`, or the same in YAML.

```
locales/en/menu.json
locales/en/menu/sections.json
locales/nl/menu.json
```

The namespace is the first path segment under the language. Split one namespace across files by
putting them in a directory: `menu/sections.json` contributes its keys under `sections`. A namespace
is always fetched as one module, whatever it is split into.

## The search

The search starts at the application and follows every package it depends on, through runtime
dependencies, peers, and its own development dependencies. Only packages under the application's
scope are followed, because a walk that read every dependency of a rendering engine would open
hundreds of manifests to find no catalogue in any of them. Pass `scopes` to follow others.

Packages are read deepest first and the application last, so where two name the same language and
namespace the application's words win. A package is resolved the way its import is, so a workspace
link and an installed copy are found alike.

## virtual:i18n

```ts
import { catalogues } from "virtual:i18n";
```

`catalogues` carries the languages and namespaces found, the fallback language's words inlined so
the first paint has them, and a loader that fetches any other language's namespace as one module.
Set `eager` to inline every language and fetch nothing. A workspace with no catalogue at all gets
empty lists and an empty loader table, and the module runs.

Each module lists the catalogue files it read as files to watch, so a bundler that rebuilds on a
watched file's change rebuilds the module. The catalogues module also lists a stamp file the plugin
rewrites whenever a language or a namespace appears or disappears, because a directory handed to a
watcher says nothing about a file appearing under it.

Add the types with a triple-slash directive from a file the project already compiles.

```ts
/// <reference types="@stealthscale/vite-plugin-i18n/client" />
```

## Generated types

The plugin writes `src/i18n.gen.d.ts`, which adds every namespace to the foundation's `Resources`
interface with each word as the string literal it is. A key that does not exist and a placeholder
left out of a call are both errors in the editor. Set `types` to another path, or to `false` to
write none.

## The build gate

A build fails on any of three faults:

- A key the fallback does not define.
- A placeholder a translation drops.
- One owner declaring a key in two files.

A dev server reports all three and keeps serving.

A plural form is checked against any form of the same key, and may write the count out in words:
`één pagina` is accepted against `{{count}} page`. Every other placeholder is still required.

## Hot updates

On a dev server that serves a module per file, a changed catalogue is sent to the page as an
`i18n:catalogue` event carrying the pair merged afresh. The foundation replaces the words in place,
so the page keeps its state, and the types are written again for a key or a placeholder the edit
added. A file joining a namespace that exists is pushed the same way. A language or a namespace
appearing or disappearing changes the set a running page holds, so the catalogues module is handed
back for a reload rather than pushed.

A dev server that bundles runs no hot update hook. There, a change to a catalogue rebuilds the
modules that listed it, a language or a namespace appearing rewrites the stamp the catalogues module
listed, and the types are written again from `watchChange`. A watching build follows the same path.

## Licence

MIT. See [LICENSE](LICENSE).
