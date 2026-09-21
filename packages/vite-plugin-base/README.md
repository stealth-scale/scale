# @stealthscale/vite-plugin-base

`@stealthscale/vite-plugin-base` holds what every plugin in this repository builds on. `plugin`
turns a name and one write step into a bundler plugin. The readers report the installed packages a
finished build imported from, the packages a manifest depends on, what an export map publishes, and
what the workspace lockfile pinned. `imported` loads a module through Vite under the application's
own export conditions, `literal` writes a value as source for a generated file, and the two writers
put a generated file on disk without waking the watcher.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-base
```

The package peers on `vite` 8 and `vitest` 4. Install both. `engines.node` is `>=26.0.0`.

## Usage

```ts
import { licensed, manifestAt, plugin, reached, text } from "@stealthscale/vite-plugin-base";

export function inventory() {
  return plugin({
    name: "example:inventory",

    writes(bundling, at) {
      const components = [...reached(bundling).values()].map((one) => ({
        licences: licensed(one.at).map((file) => file.named),
        named: one.named,
        version: text(one.manifest, "version"),
      }));

      bundling.emitFile({
        fileName: "inventory.json",
        source: JSON.stringify({ components, named: text(manifestAt(at) ?? {}, "name") }),
        type: "asset",
      });
    },
  });
}
```

Add the plugin this returns to `plugins` in a Vite configuration. `writes` runs at `generateBundle`,
where the module graph is complete and the output is not yet on disk. A file the write step emits
there becomes part of the bundle. The bundler awaits a promise the write step returns before it
closes the bundle.

A plugin that generates files rather than emitting them writes its own hooks and reads the rest of
this package from them:

```ts
import { dependencies, imported, literal, writeIfChanged } from "@stealthscale/vite-plugin-base";
import { type Plugin } from "vite";

export function registry(): Plugin {
  let root = process.cwd();
  let conditions: readonly string[] | undefined;

  return {
    name: "example:registry",

    configResolved(config) {
      root = config.root;
      conditions = config.ssr.resolve?.conditions;
    },

    async buildStart() {
      const publishing = dependencies(root).filter((one) => one.manifest["exports"] !== undefined);
      const entries = await Promise.all(
        publishing.map((one) => imported<{ default: unknown }>(one.named, { conditions, root })),
      );

      for (const { files } of entries) for (const file of files) this.addWatchFile(file);

      writeIfChanged(
        `${root}/node_modules/.registry.mjs`,
        `export default ${literal(entries.map((one) => one.module.default))};\n`,
      );
    },
  };
}
```

## Reference

| Export            | Signature                                                                                            | What it returns                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `plugin`          | `(stated: Stated) => Plugin`                                                                         | A plugin that writes once, at `generateBundle`                                                                   |
| `reached`         | `(bundling: Bundling) => ReadonlyMap<string, Reached>`                                               | Each package the build reached, keyed by directory                                                               |
| `dependencies`    | `(root: string) => readonly Dependency[]`                                                            | Each package reachable through `dependencies` from the manifest at `root`, once, placed after what it depends on |
| `packageAt`       | `(name: string, from: string) => string \| undefined`                                                | The real directory of a package, found through the `node_modules` above the package depending on it              |
| `resolvedOnGraph` | `(root: string, name: string, graph?: readonly Dependency[]) => string \| undefined`                 | The entry of a package, resolved from the root or from any package on its graph                                  |
| `exportTarget`    | `(manifest: Manifest, subpath: string, conditions?: readonly string[]) => string \| undefined`       | The target the export map names for the subpath under the conditions, read the way Node reads it                 |
| `imported`        | `<Module>(id: string, loading: Loading, server?: ViteDevServer) => Promise<Imported<Module>>`        | The module Vite resolved and evaluated, with the files behind it                                                 |
| `importer`        | `(loading: Loading, server?: ViteDevServer) => Promise<Importer>`                                    | An importer over one environment, for a batch of modules                                                         |
| `literal`         | `(value: unknown, path?: string) => string`                                                          | The source that reproduces the value. It throws for a function or an instance, naming the path                   |
| `locked`          | `(from: string) => ReadonlyMap<string, Installed>`                                                   | What the nearest lockfile above `from` pinned, keyed by `name@version`                                           |
| `installedOf`     | `(pinned: ReadonlyMap<string, Installed>, name: string, version?: string) => Installed \| undefined` | The record an installation matches, or nothing where the lockfile cannot vouch for it                            |
| `withLock`        | `<Result>(at: string, work: () => Promise<Result>, locking?: Locking) => Promise<Result>`            | What the work returned, run while a lock directory at `at` was held                                              |
| `owning`          | `(from: string) => string \| undefined`                                                              | The directory of the package a file belongs to                                                                   |
| `manifestAt`      | `(at: string) => Manifest \| undefined`                                                              | The package.json parsed out of one directory                                                                     |
| `licensed`        | `(at: string) => readonly Licensed[]`                                                                | The licence files in a package's top directory                                                                   |
| `text`            | `(manifest: Manifest, field: string) => string \| undefined`                                         | The field's value, when that value is a string                                                                   |
| `writeIfChanged`  | `(at: string, content: string) => boolean`                                                           | True when the file was written, false when it already held the content                                           |
| `emptyDir`        | `(at: string) => void`                                                                               | Nothing. The directory and everything under it are deleted                                                       |
| `syncDir`         | `(from: string, to: string) => void`                                                                 | Nothing. `to` holds exactly the files of `from`, and only the files that differed were written                   |
| `scratchDir`      | `(plugin: string, root: string) => string`                                                           | The directory a plugin's scratch for one package goes under, outside the workspace                               |

| Type         | What it describes                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `Bundling`   | The build a bundler binds to `this` while it generates a bundle                                 |
| `Dependency` | One package the walk reached, under `at`, `dependsOn`, `manifest` and `named`                   |
| `Imported`   | A module under `module`, beside the `files` its evaluation read                                 |
| `Importer`   | An `import` function over one environment, and the `close` that releases it                     |
| `Installed`  | What a lockfile pinned for one package: `integrity`, `registry` and `resolution`, each optional |
| `Licensed`   | One licence file, under `named` and `text`                                                      |
| `Loading`    | Where an import resolves from, under `root`, and the `conditions` it resolves under             |
| `Locking`    | The bounds on waiting for a lock: `grace` and `wait`, each in milliseconds and optional         |
| `Manifest`   | A parsed package.json, typed as `Readonly<Record<string, unknown>>`                             |
| `Plugin`     | Vite's own plugin type, re-exported                                                             |
| `Reached`    | One package, under `at`, `dependsOn`, `manifest` and `named`                                    |
| `Stated`     | The description `plugin` takes, under `name` and `writes`                                       |

## The project directory

`at` is the directory the bundler resolved, recorded when Vite calls `configResolved`. Under a task
runner the working directory is the workspace root, so a plugin reading `process.cwd()` describes
the wrong package.

Note: rolldown defines no `configResolved` hook. A build that resolves no configuration passes the
write step the directory the process started in.

## Reading the graph

`reached` keys its answer by package directory, so two installs of one name are two entries. Four
kinds of module stay out of the result:

- A module outside `node_modules`. The test splits the path into segments, so a directory named
  `node_modules_old` is not mistaken for an install.
- A module with no package.json above it.
- A module whose nearest manifest does not parse, or parses to anything but an object.
- A module whose nearest manifest does not declare a `name`.

Every reader here returns undefined, or an empty result, where the file system refuses. One
dependency with an unreadable manifest costs the crawl an entry and never fails the build.

## Walking the dependencies

`dependencies` starts at the manifest in `root` and reads `dependencies` alone: a peer is installed
by whoever depends on the package, and a development dependency is the package's own business. Each
package is found from the package that names it, through the `node_modules` directories above it,
the way Node looks a package up, so a package is found where the package manager put it for that
dependent. The manifest is read rather than resolved, so a package whose export map withholds
`package.json` is found, and so is one that publishes for `import` alone. A package that is not
installed is skipped, and so is one whose manifest does not parse. Each installation is listed once
under its real directory, so two installed versions of one name are two entries. The result places a
package after every package it depends on, which is the order a consumer needs when a later
contribution has to win over an earlier one. Two packages depending on each other are placed in the
order they were met.

`resolvedOnGraph` resolves one package's entry the same way, from the root first and then from each
package on the graph, which finds a package that only a dependency declares. A caller that resolves
several entries walks the graph once and hands it in.

## Reading an export map

`exportTarget` reads the target a manifest publishes a subpath as, the way Node reads it. A
conditions object is read in the order its keys are written, and a key is followed where it is
`default` or one of the conditions given. A key that leads nowhere passes the search to the next
key, so a condition nested under another falls back. An array target is tried element by element. A
`null` target is a subpath the package withholds, and it reads as unpublished. A string export map
is the `.` subpath. A map whose keys are conditions rather than subpaths is the `.` subpath as well.
A subpath pattern such as `./*` is not expanded. A plugin reads an export map where it has to name a
file rather than import it: to write a path into a generated file, or to load a package's own
subpath from inside that package.

## Importing through Vite

`imported` resolves and evaluates a module under the conditions in `loading.conditions`, so a
workspace package that publishes its source under a condition of its own resolves to the source
rather than to the built output Node would pick. With a dev server whose `ssr` environment is
runnable, the import goes through that runner and joins the server's module graph, so an edit to any
file behind the module reaches the plugin as a hot update. Without one, an environment of the
function's own is built for the one import and closed afterwards. `files` lists every file the
evaluation read, the module's own first, which is what a plugin passes to `addWatchFile`.

`importer` opens that environment once and returns an `import` function and a `close`. A plugin that
loads a statement and every preset behind it imports them all through one importer, because building
an environment resolves a configuration and starts a module runner, and that cost is taken once
rather than once per module. Closing an importer over a dev server leaves the server's environment
running.

## Reading the lockfile

`locked` climbs from a directory to the nearest ancestor holding a lockfile it recognises, reads
`bun.lock` first and `pnpm-lock.yaml` second, and returns what the file pinned for each package
version: the integrity the manager checked the download against, the registry where it was not the
default one, and the version or the reference that stands where a version would. The map is keyed by
`name@version`, so two installed versions of one package are two records. `installedOf` picks the
record an installation matches: the exact version where the manifest states one, or the one record
under the name where none is stated or the lockfile keys it by a reference. A version the lockfile
does not pin, two records under one name with no version to choose by, and a record written for an
alias all yield nothing, because a digest that belongs to another copy is worse than none. A
lockfile that is missing or does not parse yields an empty map and never fails a build.

## Writing generated files

`literal` writes a string, a number, a boolean, null, undefined, a regular expression, an array or a
plain object as the source that reproduces it, and refuses a function, an instance of a class, a
symbol or a bigint, naming the path where the value is. `writeIfChanged` compares the content with
what is on disk and writes only on a difference, which keeps a watcher from chasing a plugin's own
output round a loop. The content goes to a hidden file beside the target and is renamed into place,
so a reader never sees part of a write. `emptyDir` clears a generated directory before a generator
runs again, and does nothing when the directory is absent. `syncDir` makes a directory hold exactly
the files of another: a file that differs is written, a file the source no longer holds is deleted
along with any directory that is left empty, and an unchanged file is not touched, so a watcher over
the target reports the files that changed and no others. The source is listed before anything is
written or deleted. A source that cannot be listed stops the sync with an error and the target as it
was, because a directory that cannot be read is not an empty one.

## Keeping scratch outside the workspace

`scratchDir(plugin, root)` names a directory under the system's temporary directory, under the
plugin's name and a digest of the package's root. A task runner fingerprints what a build reads and
writes inside the workspace, and refuses to cache a build that did both to one file. A rendered
configuration, a lock and a stamp are each written by a plugin and read back by the same plugin, so
they go here and count as neither an input nor an output. The directory is the same for the same
root and another for another root, and nothing creates it: the first write does.

## Holding a lock across processes

`withLock` runs work while it holds a lock directory at a path, and releases the lock afterwards
whether the work returned or threw. A generator that renders a configuration, runs a compiler over
it and publishes the result holds mutable intermediates for the whole run, and two processes in one
checkout, such as a type check beside a dev server, would otherwise read what the other is writing.
Creating a directory is atomic on every file system, so the second process finds the lock taken and
polls. The lock records the process that took it and when. A lock whose owner is no longer running,
or that stood without an owner for longer than `grace` (one second), is taken over. A lock a living
process holds for longer than `wait` (thirty seconds) makes the waiter give up with an error that
names the owner, so a hung process is found rather than waited on for ever.

## Licence

MIT. See [LICENSE](LICENSE).
