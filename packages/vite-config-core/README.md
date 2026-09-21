# @stealthscale/vite-config-core

`@stealthscale/vite-config-core` defines what a layer is and composes a list of layers into one Vite
configuration. A removal runs first and takes an earlier layer back by name. The presets then merge
their configuration keys. Each contribution appends to a list a preset declared, and each override
rewrites the result at the end.

## Install

```bash
pnpm add -D @stealthscale/vite-config-core
```

The package peers on `vite` and `vitest`. Install both. It requires Node 26 or later.

`@stealthscale/vite-config` peers on this package and re-exports every export here apart from
`Context` and `contextOf`, so a repository extending one of that package's five tiers already has
the kernel installed.

## Usage

```ts
import { defineConfig, preset } from "@stealthscale/vite-config-core";

export default defineConfig(import.meta.dirname, {
  extends: [
    preset({
      config: (context) => ({ resolve: { alias: { "#": `${context.at}/src` } } }),
      name: "reports.alias",
    }),
  ],
});
```

A configuration is bundled to a temporary file outside its own package before it runs, so the
directory is declared rather than discovered. Pass `import.meta.dirname` and nothing else. Keys
written beside `extends` merge over whatever the layers decided. `extends` itself never reaches
Vite.

A package that publishes a tier binds its default layers once and exports the result.

```ts
import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import * as lint from "#lint/index.ts";
import * as pack from "#pack/index.ts";

export function layers(): readonly Extendable[] {
  return [lint.preset.node(), pack.preset.node()];
}

export const defineConfig: Defining = configuring(layers);
```

`configuring` reads the defaults once per invocation rather than once per call. A tier that derives
its list from the environment is read again on every build. The defaults come first in the list a
package extends. A removal applies only to layers above it, so a package can take a default back.

## Reference

The entry point publishes twelve functions and thirteen types.

| Export              | Signature                                                                         | What it returns                                                           |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `defineConfig`      | `(at: string, config: Config \| ConfigFn \| Promise<Config>) => UserConfigExport` | The composed configuration, with the caller's own keys merged over it     |
| `configuring`       | `(defaults: () => readonly Extendable[]) => Defining`                             | A `defineConfig` that lays a tier's defaults under what a package extends |
| `preset`            | `(stated: Omit<Stated<Preset>, "kind">) => Preset`                                | A layer that merges configuration keys                                    |
| `contribute`        | `(stated: Omit<Stated<Contribution>, "kind">) => Contribution`                    | A layer that appends one item to a list                                   |
| `remove`            | `(stated: Omit<Stated<Removal>, "kind">) => Removal`                              | A layer that takes an earlier layer back by name                          |
| `override`          | `(stated: Omit<Stated<Override>, "kind">) => Override`                            | A layer that rewrites the merged configuration                            |
| `named`             | `<Of extends Layer>(name: string, layer: Of) => Of`                               | The same layer under a new name                                           |
| `owned`             | `(name: string, layers: readonly Extendable[]) => readonly Layer[]`               | The flattened layers, renamed `owner/name`                                |
| `contextOf`         | `(env: ConfigEnv, declared: string, from?: string) => Context`                    | The context passed to every layer                                         |
| `appended`          | `<Of extends object>(held: Of, path: string, item: unknown) => Of`                | A copy of `held` with `item` appended to the list at the dotted path      |
| `located`           | `(specifier: string, from: string) => string`                                     | The file URL of a package's entry, resolved from the module at `from`     |
| `resolvingMetadata` | `() => boolean`                                                                   | Whether the toolchain is reading the configuration for its metadata alone |

| Type         | What it describes                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `Apply`      | The commands a layer takes part in: `"build"`, `"serve"`, or a function handed the environment            |
| `Config`     | A Vite `UserConfig` with an `extends` list of layers                                                      |
| `ConfigFn`   | A configuration written as a function of the context                                                      |
| `Context`    | What is being configured and where it sits                                                                |
| `Defining`   | The signature a tier's `defineConfig` presents, with the configuration argument optional                  |
| `Extendable` | A layer, or an array nesting layers to any depth                                                          |
| `Layer`      | Any of `Contribution`, `Override`, `Preset` and `Removal`, distinguished by `kind`                        |
| `Manifest`   | The `package.json` fields the kernel reads: `dependencies`, `exports`, `name`, `version` and `workspaces` |
| `Stated`     | A layer as a caller writes it, before it is branded                                                       |

`Context` extends Vite's `ConfigEnv`, so a layer reads `command`, `mode`, `isSsrBuild` and
`isPreview` from it alongside four fields of its own.

| Field      | What it is                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| `at`       | The directory being configured, which is the root for a workspace-wide run |
| `root`     | The workspace root, equal to `at` outside a workspace                      |
| `manifest` | The manifest sitting at `at`, or an empty object where there is none       |
| `env`      | Every variable in scope, merged from the root, the package and the shell   |

`contextOf` climbs from the declared directory until it meets one that declares workspace globs,
either in its manifest or in a `pnpm-workspace.yaml` beside it. A variable reaches `env` under the
`STEALTH_` or the `VITE_` prefix, and `CI`, `CI_COMMIT_SHA` and `GITHUB_SHA` reach it by name. The
root's files are read first and the package's are laid over them. A variable already set in the
process environment overrides both. A variable with neither prefix is the shell's business: the task
runner fingerprints what a configuration read, and a session path or a manager's flag would miss the
cache on every shell that differs.

The toolchain sets `VP_RESOLVING_CONFIG_METADATA=1` while it reads a configuration for its metadata
alone: the task runner planning the graph, a check reading the lint and format blocks, and the
packer reading the `pack` block. Under it, a contribution to `plugins` is passed over without being
worked out, so planning the graph constructs no Vite plugin. A contribution to `pack.plugins` is
worked out, because the packer takes its plugins from what it read. `resolvingMetadata()` reports
the marker to a layer that has to know.

A layer that loads a plugin package when the plugin is constructed writes the import as
`import(located("@scope/plugin", import.meta.url))`. The bundler that reads a configuration resolves
every import it can read, so a literal specifier fails the resolution where the package is not built
yet, and `located` resolves from the module that names the package rather than from the temporary
file a bundled configuration runs from.

## Layer kinds

Each constructor takes a plain object and returns it branded. The brand hangs on a symbol this
package never exports, so an object with the right fields is still rejected where a layer is
expected. The brand exists in the type alone. A minted layer serialises as exactly what the caller
wrote.

| Kind           | Fields it states            | Fields it may state       |
| -------------- | --------------------------- | ------------------------- |
| `Preset`       | `name`, `config`            | `apply`, `enforce`        |
| `Contribution` | `name`, `because`, `at`     | `apply`, `item`, `itemOf` |
| `Removal`      | `name`, `because`, `target` | `apply`                   |
| `Override`     | `name`, `because`, `refine` | `apply`                   |

- `config` takes a `UserConfig`, or a function given the context that may return a promise.
- `at` is a run of property names separated by dots, such as `test.setupFiles`. A path cannot name a
  property whose own name contains a dot.
- `item` is the value to append. A contribution stating `itemOf` as well appends what that function
  works out from the context, and `item` is ignored.
- `target` names the layer to take back. `refine` receives the context and the configuration
  composed so far. It returns the configuration to continue with.
- `apply` decides which commands the layer takes part in. A layer stating none takes part in every
  command. The string form is matched against the command, and the function form receives the whole
  environment, which includes the mode.
- `enforce` orders one preset among the rest. An absent value sorts with `pre`, `post` sorts after
  both, and the sort is stable.

A preset has no `because` field at all. Each of the other three kinds requires one.

## Composition order

`defineConfig` settles a configuration in seven steps.

1. The `extends` nest is flattened depth first, so the order on the page is the order the layers
   take.
2. Every layer whose `apply` rules out this command is dropped.
3. Each removal deletes the nearest layer above it with the target name.
4. The presets merge through Vite's own `mergeConfig`, in enforcement order.
5. Each contribution appends its item at the path it names.
6. Each override rewrites what the step before it produced, in the order the overrides were written.
7. The keys written beside `extends` are merged over the result.

Warning: a removal with no matching layer above it throws rather than being ignored. Step 2 runs
before it, so a removal aimed at a layer that only applies to `serve` needs the same `apply` on
itself. A build throws otherwise.

Step 4 settles the preset configurations concurrently. One preset's function cannot depend on
another's having run. Where two contributions name the same path, both items are appended in
flattened order, and neither is merged into the other. A path whose value is not an array is
replaced by a list containing the one item. An override reads what the layers decided. It never
reads the keys the caller wrote beside `extends`, because step 7 merges those afterwards.

## Licence

MIT. See [LICENSE](LICENSE).
