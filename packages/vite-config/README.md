# @stealthscale/vite-config

`@stealthscale/vite-config` configures Vite+ for every package in a Stealth Scale repository. A
package extends exactly one of five tiers, chosen by what the package is rather than by what it
contains. Layers written beside the tier settle whatever it leaves open, and the keys written beside
those layers merge over the result. The package root re-exports the layer kernel from
`@stealthscale/vite-config-core`, so one import covers both the layers and the functions that mint
them.

## Install

```bash
pnpm add -D @stealthscale/vite-config
```

The package peers on `vite`, `vitest`, `@stealthscale/vite-config-core`,
`@stealthscale/vite-plugin-sbom`, `@arethetypeswrong/core`, `@vitest/coverage-v8`,
`eslint-plugin-jsdoc`, `eslint-plugin-perfectionist`, `eslint-plugin-tsdoc` and `publint`. Install
all ten.

Three further peers are optional, and each one is loaded only by the layer that needs it.

| Optional peer                | Loaded by                                                 |
| ---------------------------- | --------------------------------------------------------- |
| `happy-dom`                  | The document the web tier and the app tier test against   |
| `@module-federation/vite`    | `federation.host()` and `federation.remote()`             |
| `@vitest/browser-playwright` | `test.browser()`, which also needs `playwright` beside it |

## Usage

Name the directory and take the tier:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
```

A configuration is bundled to a temporary file outside its own package before it runs. The directory
has to be declared rather than discovered, so `import.meta.dirname` is the only spelling that still
points at the package once the bundling has moved the file.

Put whatever the tier does not cover in `extends`, and write the keys you want to set yourself
beside it:

```ts
import { deps, preview, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [
    deps.crawl({
      because: "a worker is started from a URL, which no crawl follows as an import",
      files: ["src/*.worker.ts"],
    }),

    server.port(4500),
    preview.port(4501),
  ],
});
```

The layers in `extends` compose first and the caller's own keys merge over what they produced. Each
value is merged rather than replaced, so an array you write is appended to the one the layers built.
The `extends` key itself never reaches Vite.

The second argument also accepts a function of the context, or a promise. A function runs once per
invocation and before any layer does, so the list it puts in `extends` can differ between a build
and a serve.

## Tiers

Choose the tier from what the package is, and extend exactly one. Each subpath hangs off
`@stealthscale/vite-config`.

| Subpath              | Extend it from                                               |
| -------------------- | ------------------------------------------------------------ |
| `./preset/base`      | A published package that commits to no runtime               |
| `./preset/node`      | A published package that runs on node                        |
| `./preset/web`       | A published package that runs in a browser                   |
| `./preset/app`       | A browser application that is deployed rather than published |
| `./preset/workspace` | The root of a repository                                     |

Each subpath exports `defineConfig` for a configuration file and `layers()` for the list underneath
it. Call `layers()` where you compose a tier into something larger instead of exporting it, which is
how the workspace tier builds on the node tier.

The base tier puts no globals in scope, so anything from node or the browser is imported by hand.
The node tier puts node's globals in scope and withholds the browser's. The web tier does the
reverse and runs each test against a DOM. The app tier packs nothing at all, because an application
has no consumer to read an exports map, and configures build output and a module worker instead.

Note: `run.cache()`, `run.ci()`, `staged.checked()`, `staged.formatted()` and `test.projects()`
reach the workspace tier alone. A task table, a commit hook and the project list are read once for
the whole tree, so declaring any of them inside a package makes every package repeat it while the
runner reads the root's copy anyway.

## Reference

Sixteen namespaces sit at the package root, one for each part of a configuration.

### Blocks

| Namespace    | What it configures                                                                       |
| ------------ | ---------------------------------------------------------------------------------------- |
| `build`      | The output of a deployed application: chunks, preloads, source maps, inventories         |
| `define`     | The constants a build substitutes into a bundle, starting with name and version          |
| `deps`       | Which dependencies Vite pre-bundles, and which files the scan walks to find them         |
| `federation` | Both sides of a module federation boundary, the host and the remote                      |
| `fmt`        | The formatter: doc comments, import order, manifest key order, prose and style           |
| `lint`       | The lint tiers, and the departures a repository states on top of one                     |
| `pack`       | The packer that publishes a library: entries, declarations, platform, built-ins, quality |
| `preview`    | The preview server: port, interface, hostnames, shared origins and headers               |
| `resolve`    | What makes a workspace import reach source rather than built output                      |
| `run`        | What a workspace root tells the task runner: the result cache and the task table         |
| `server`     | The development server: port, interface, hostnames, proxied paths and bundling           |
| `serving`    | The hosts and origins a machine states in `STEALTH_HOSTS` and `STEALTH_ORIGINS`          |
| `ssr`        | A server-side render build: which dependencies it bundles, and which runtime             |
| `staged`     | The work a commit does over the files it stages                                          |
| `test`       | The runner: environment, coverage, isolation, collection, order and projects             |
| `worker`     | The module format a bundled worker is emitted in                                         |

Note: the linter and the formatter run from the workspace root and read the root configuration only.
A `lint` or `fmt` layer written in a package composes and merges as any other layer does, and
neither tool ever reads it. Express a package's own rules as the glob that selects its files.

Setting `STEALTH_HOSTS` or `STEALTH_ORIGINS` replaces the list the repository declared rather than
adding to it. Each is a comma-separated list, so a developer gets the names they arranged on their
own machine and no others.

The packer's layers hold for every form the packer accepts. `pack.hook()` schedules its moments on
every bundle of a `pack` written as a list, and keeps a registrar function another layer wrote by
calling it first and adding the moments to the same table. `define.manifest()` writes its constants
for the packer as well as for Vite, so a library reaches its own name and version as literals.
`pack.published()` derives entries for a package that is its own root as it does for one below a
workspace root: the workspace root is told apart by the globs its manifest declares, not by its
position. `pack.preset.node()` states the `node` platform, and `pack.preset.web()` states `neutral`
and refuses a Node built-in at the pack through `pack.builtins()`, so a library packed for a browser
fails where the import is written rather than in the browser. The refusal follows the platform in
effect: a package on the web tier that states `pack.platform("node")` over it is refused nothing.
`build.chunks()` claims no module of the application's own: each entry keeps what it reaches, so two
pages of one build run their own bootstrap.

## Layers

The package root exports a constructor for each of the four kinds of layer. Each layer is branded
with a symbol the kernel never exports, so an object with the right fields is rejected where a layer
belongs.

| Kind           | Minted by      | What it does                                              |
| -------------- | -------------- | --------------------------------------------------------- |
| `Preset`       | `preset()`     | Merges config keys, before any contribution appends       |
| `Contribution` | `contribute()` | Appends one item to the list at the dotted path it names  |
| `Removal`      | `remove()`     | Takes back the nearest layer above it that `target` names |
| `Override`     | `override()`   | Rewrites the composed config after every other kind runs  |

```ts
import { contribute } from "@stealthscale/vite-config";

const layer = contribute({
  at: "test.setupFiles",
  because: "the theme registers its custom properties before a component reads one",
  item: "./src/theme.setup.ts",
  name: "theme.setup",
});
```

Removals run first. A removal targeting a layer that nothing above it stated throws rather than
being ignored. The presets then merge their configuration keys. Each contribution appends to a list
a preset declared, and each override rewrites the result at the end.

A layer of any kind has a `name` a removal can target. A contribution, a removal and an override
each take a `because` as well, which the type requires. A layer states `apply` to take part in a
build alone, in a serve alone, or in whatever a predicate on the environment decides. A layer
stating none takes part in everything. The environment is filtered before removals run, so a removal
aimed at a layer that does not apply here throws on the build where it does not.

`named`, `owned` and `configuring` come from the kernel too. `named(name, layer)` renames a layer
and copies every other field across. `owned(owner, layers)` prefixes a whole nest with `owner/`,
which is the full name a consumer's removal has to target. `configuring(defaults)` builds a
`defineConfig` of your own with those defaults laid under whatever a package extends, which is what
each of the five tiers exports.

The kernel's types are exported alongside them: `Apply`, `Config`, `ConfigFn`, `Contribution`,
`Defining`, `Extendable`, `Layer`, `Manifest`, `Override`, `Preset`, `Removal` and `Stated`.

## Add-ons

A framework arrives as a config package of its own, such as `@stealthscale/vite-config-react` or
`@stealthscale/vite-config-css`. Each one exports `layers()` to add beside a tier and `workspace()`
to add at the repository root.

```ts
import * as css from "@stealthscale/vite-config-css";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), css.layers()],
});
```

What `layers()` adds is what a package needs while it builds and while it tests, such as the JSX
transform and the document a test renders into. What `workspace()` adds is the rules and the import
order the root applies across the tree. Add both, each in the file that reads it.

## Licence

MIT. See [LICENSE](LICENSE).
