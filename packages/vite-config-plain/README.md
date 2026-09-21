# @stealthscale/vite-config-plain

`@stealthscale/vite-config-plain` exports one Vite configuration object that sets the `pack`,
`resolve`, `ssr` and `test` blocks a published node package needs. The `node` tier of
`@stealthscale/vite-config` composes the same settings out of layers, and a package that can depend
on that tier extends it instead. `@stealthscale/vite-config-core`, `@stealthscale/vite-plugin-base`
and `@stealthscale/vite-plugin-sbom` cannot depend on it, because the tiers are built on them.

## Install

```bash
pnpm add -D @stealthscale/vite-config-plain
```

The package peers on `vite` and `vitest`. Install both.

## Usage

```ts
import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
```

`defineConfig` receives the object exactly as this package exports it, and no layer composes it
first. Spread it to change a key. A key written after the spread replaces the value this package
set.

Note: the entry is fixed at `src/index.ts`. A package that publishes more than one subpath extends a
tier, which reads the entry map out of `package.json` instead.

## Reference

`plain` sets four blocks and nothing besides. Its type is Vite's `UserConfig`.

| Block     | What it configures                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `pack`    | One entry from `src/index.ts`, its declarations, and the `attw` and `publint` checks                    |
| `resolve` | The client conditions, with `stealth-source` ahead of Vite's defaults                                   |
| `ssr`     | The server conditions, with `stealth-source` ahead of Vite's server defaults                            |
| `test`    | The `**/*.spec.{ts,tsx}` glob, the `node` environment, a shuffled order, and the mock and stub handling |

Between tests the runner clears every mock and restores every spy. An environment variable or a
global that a test stubbed is put back. `expect.requireAssertions` fails a test that asserted
nothing. `globals` is off, so a test file imports `describe` and `it` rather than finding them
ambient. Both settings reject a suite that most runners accept.

`vp pack` writes a `stealth-source` condition into the published `exports` map for every built
subpath, pointing at the TypeScript that subpath was built from. Nothing outside a stealth workspace
sets that condition, so a consumer installing from a registry resolves past it to the built file.

Note: the `vite-plus` type declarations declare `pack` on `UserConfig`. A tsconfig that does not
list `vite-plus` under `types` reports the key as unknown.

## Coverage and the bill of materials

The `node` tier measures coverage and writes a CycloneDX bill of materials for the files it packs.
This value sets neither key, so a package configured from here builds and tests without either. The
`pack`, `resolve`, `ssr` and `test` blocks otherwise agree with the tier, and a specification in
this package composes the tier and compares all four.

## The dependency cycle

A tier asked to pack `@stealthscale/vite-config-core`, `@stealthscale/vite-plugin-base` or
`@stealthscale/vite-plugin-sbom` would build that package from a version of itself.
`@stealthscale/vite-config` declares a peer dependency on the layer kernel and on the bill of
materials plugin, and that plugin declares one on `@stealthscale/vite-plugin-base`. This package
packs under its own export as well, so a defect in the value fails its own build first.

## Licence

MIT. See [LICENSE](LICENSE).
