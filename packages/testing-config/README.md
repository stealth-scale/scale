# @stealthscale/testing-config

`@stealthscale/testing-config` reads a config, plugin or library package and lists every part of the
house contract that package breaks. Each violation is one sentence that names the check, the thing
and the expectation, so a specification asserting an empty array fails with the sentence you need to
fix it. You pass the directory of the package's manifest and the barrel your specification has
already imported. The package under check is never resolved from its published name.

## Install

```bash
pnpm add -D @stealthscale/testing-config
```

It peers on nothing and imports two node built-ins. It asserts nothing of its own, so any runner
that awaits a promise can run the check.

## Usage

```ts
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-config-react", () => {
  it("keeps the config package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        kind: "config",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
```

A specification names `at` as the directory of the manifest, and `package.json` and `README.md` are
read from there. A plugin package writes the same call with `kind: "plugin"`, and a plain library
writes it with `kind: "library"`. The kind decides which checks run.

A config package supplies what the check cannot work out for itself:

```ts
await violations({
  arguments: {
    "lint.relax": [{ because: "a reason a reviewer can weigh", files: ["src/**"], rules: {} }],
    "server.port": [4200],
  },
  at: join(import.meta.dirname, ".."),
  kind: "config",
  module: published,
  tiers: { "preset/app": app, "preset/base": base },
});
```

Each key in `arguments` is the dotted path a consumer writes at a call site. A factory with required
parameters and no entry there goes uncalled and is reported. Each key in `tiers` is a `./preset/`
subpath from the export map with its leading dot removed, and a published subpath left out is
reported. The specification supplies the tier modules because it imports its own package by subpath
and this package cannot.

## What it checks

Sixteen checks run over a package. Every check the kind selects runs, and a breach found by one
never stops another, so one run reports the whole set.

| Check              | Kind       | Reports                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manifest.exports` | Every kind | A target naming a file that is not on disk, a conditional subpath whose `default` is not under `dist`, a `stealth-source` that is not a file under `src`, and a `publishConfig.exports` map that disagrees with the workspace map                                                                                               |
| `manifest.files`   | Every kind | `LICENSE` or `README.md` missing from `files`, a listed entry other than `dist` that is not on disk, and a built target no entry covers                                                                                                                                                                                         |
| `manifest.engines` | Every kind | An unstated `engines.node`, and a range differing from the one the workspace root states                                                                                                                                                                                                                                        |
| `manifest.peers`   | Every kind | A peer that is also a dependency, `vite` or `vitest` peered as anything but `catalog:peer`, a peer on `vite-plus`, and a config package peering on nothing named `vite`                                                                                                                                                         |
| `source.specs`     | Every kind | A file under `src` with no `.spec.ts` or `.spec.tsx` beside it. Spec, fixtures, specimen, example and declaration files are skipped, and so is a module that exports only types. A barrel is skipped unless the package passes `barrels: true`                                                                                  |
| `source.declared`  | Every kind | A package a file under `src` imports that the manifest lists under neither `dependencies` nor `peerDependencies`. A subpath resolves to the package that publishes it. Relative paths, `#` subpaths and `node:` builtins are ignored. Spec, fixtures, specimen and example files are skipped, because they run in the workspace |
| `source.jsx`       | Every kind | A file suffixed `.tsx` that writes no JSX. The other way round needs no check, a compiler refusing JSX in a `.ts` file                                                                                                                                                                                                          |
| `module.factories` | Config     | An export that is neither a function, a namespace nor a constant, and a factory with required parameters and no entry in `arguments`                                                                                                                                                                                            |
| `readme.exports`   | Config     | A block the README's `Blocks` table names that the barrel does not export, and a top-level namespace the table leaves out                                                                                                                                                                                                       |
| `layer.kind`       | Config     | A factory that throws, a return value shaped like a layer without being one, and an array mixing layers with other values                                                                                                                                                                                                       |
| `layer.named`      | Config     | A layer name with an owner prefix, and a name that is not the call that made it                                                                                                                                                                                                                                                 |
| `layer.reasoned`   | Config     | A contribution, override or removal whose `because` is empty, and a preset that states one                                                                                                                                                                                                                                      |
| `layer.unique`     | Config     | Two layers one factory returns under a single name and kind                                                                                                                                                                                                                                                                     |
| `tier.composes`    | Config     | A tier exporting no `layers()` or no `defineConfig`, a tier composing something that is not a layer or composing one twice, and a `defineConfig` that throws under a build                                                                                                                                                      |
| `plugin.named`     | Plugin     | A barrel where no export, at the top level or inside a namespace, returns a plugin; a plugin named anything but `stealth:` and its dotted export path; and a plugin without `configResolved`                                                                                                                                    |
| `plugin.peer`      | Plugin     | A plugin package peering on nothing named `vite`                                                                                                                                                                                                                                                                                |

Each factory is called once before the first check, so the four layer checks agree on what it
returned and a factory with a side effect performs it once. The layer names a factory returns are
measured against the prefix the package name yields: `@stealthscale/vite-config-react` requires
`react`, and `@stealthscale/vite-config` requires no prefix at all.

Note: `manifest.engines` finds the workspace root by walking up for a `pnpm-workspace.yaml`. A
package checked outside a workspace states its range and is compared against nothing.

## Reference

The barrel publishes six functions and fourteen types.

| Export        | Signature                                                                    | What it returns                                                                                                  |
| ------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `violations`  | `(stated: Conformance) => Promise<readonly string[]>`                        | Each violation, opening with the check that reported it, or an empty array for a package that keeps the contract |
| `isLayer`     | `(value: unknown) => value is Layer`                                         | True for a value with a string `name` and one of the four kinds                                                  |
| `layersOf`    | `(factories: readonly Factory[], supplied: Arguments) => readonly Found[]`   | One record per factory called, in the order the walk found them                                                  |
| `publishedOf` | `(at: string) => Published`                                                  | The parsed `package.json` in that directory. It throws where the file is absent or is not JSON                   |
| `prefixOf`    | `(name: string) => string`                                                   | The prefix on a package's layer names, empty for the base config                                                 |
| `walked`      | `(module: Readonly<Record<string, unknown>>, supplied: Arguments) => Walked` | The barrel split into factories, top-level namespaces and exports that are neither                               |

| Type            | What it describes                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `Arguments`     | The arguments each factory is called with, keyed by its dotted path in the barrel                             |
| `Check`         | The sixteen check names, one of which opens every violation a check reports                                   |
| `Conformance`   | The request: `at`, `kind` and `module`, beside the optional `arguments`, `only`, `skip` and `tiers`           |
| `Engines`       | The `engines` field as the checks read it. Only `node` is read                                                |
| `Factory`       | A callable export, as the `call` to make and the `path` it sits at                                            |
| `Found`         | What one factory produced: its `layers`, its `others`, whether it `listed` them, its `path`, and any `error`  |
| `Kind`          | `"config"`, `"library"` or `"plugin"`, the contract the package is checked against                            |
| `Layer`         | The part of a layer the checks read: its `name`, its `kind` and its `because`                                 |
| `LayerKind`     | `"contribution"`, `"override"`, `"preset"` or `"removal"`                                                     |
| `PublishConfig` | The export map npm swaps in while packing                                                                     |
| `Published`     | The manifest fields these checks read                                                                         |
| `Target`        | An export target: a single path, or a map of conditions to paths                                              |
| `Tiers`         | The tier modules a config package publishes, keyed by subpath such as `preset/app`                            |
| `Walked`        | The `factories` to call, the `namespaces` the README's block table names, and the `violations` the walk found |

## Narrowing a run

`skip` takes a check off the run, and the entry's value is the reason it comes off. A reason that is
empty or is whitespace is reported in place of the check, so no check leaves a run without a
sentence a reviewer can weigh.

```ts
await violations({
  at: join(import.meta.dirname, ".."),
  kind: "library",
  module: published,
  skip: { "manifest.engines": "this package runs on the node range its consumers ship" },
});
```

`only` cuts a run down to the checks you list, such as `only: ["layer.named"]`. Use it to narrow a
failure by hand. A specification that keeps `only` is reported for it once `CI` is set in the
environment. Both of these are breaches of the request rather than of the package, so neither has a
check name in front of it.

## Licence

MIT. See [LICENSE](LICENSE).
