# @stealthscale/vite-config-react

A package that renders extends `@stealthscale/vite-config-react` beside its tier from
`@stealthscale/vite-config`. One call adds the JSX transform, the React Compiler, the document its
tests render into, and the emptying of that document between them. A second call, written once at
the repository root, turns on the React and accessibility rules and gives React an import group of
its own.

## Install

```bash
pnpm add -D @stealthscale/vite-config-react
```

The package peers on `@rolldown/plugin-babel`, `@stealthscale/vite-config`,
`@testing-library/react`, `@vitejs/plugin-react`, `babel-plugin-react-compiler`, `happy-dom`,
`oxc-transform-react`, `react`, `react-dom`, `vite` and `vitest`. Install all eleven. A package that
writes MDX installs `@mdx-js/rollup` and `@types/mdx` as well. Both are optional peers. It runs on
Node 26 and later.

## Usage

Extend the tier a package already uses and write `layers()` beside it. Both `preset/app` and
`preset/web` compose the same layers, and each tier takes what it has a use for.

```ts
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
```

A package that writes documents in MDX asks for the MDX compiler in the same call. The layer is left
out unless asked for, so a package without documents installs nothing for them.

```ts
export default defineConfig(import.meta.dirname, { extends: [react.layers({ mdx: true })] });
```

`layers()` states no rule and no format. A linter and a formatter read the root configuration only.
A package that repeats them lints nothing extra and slows its own build down. `workspace()` declares
the rules. A repository root resolves it once for every package under it.

```ts
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/workspace";

export default defineConfig(import.meta.dirname, { extends: [react.workspace()] });
```

## Reference

Each factory named here returns a layer under the name of the call that produced it. A consumer
drops one layer by name and keeps the rest.

### Blocks

| Block        | What it configures                                                          |
| ------------ | --------------------------------------------------------------------------- |
| `federation` | React and its renderer, shared between a host and its remotes as one copy   |
| `fmt`        | The import group React and its renderer sort into                           |
| `lint`       | The linter plugins, the React rules, and the files excused from one of them |
| `plugin`     | The JSX transform, the refresh that replaces a component, and the compiler  |
| `test`       | The document a component renders into, and the emptying of it between tests |

### Layers

| Export                 | Signature                                   | What it returns                                                                                                                                              |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `layers`               | `(stated?: Rendering) => readonly Layer[]`  | `react.plugin.refresh`, both `plugin.compiler` layers, `react.test.cleanup` and `react.test.document`, plus both `plugin.mdx` layers when `mdx` is true      |
| `workspace`            | `() => readonly Layer[]`                    | Seven lint and format layers, every rule ordered ahead of every relaxation                                                                                   |
| `federation.installed` | `(read?: () => unknown) => string`          | The version string React's own manifest declares                                                                                                             |
| `federation.shared`    | `(version?: string) => federation.Shared`   | `react` and `react-dom` as singletons, at the range of the installed major                                                                                   |
| `fmt.imports`          | `() => Override`                            | An override sorting React ahead of every other import group                                                                                                  |
| `lint.fixtures`        | `() => Contribution`                        | A relaxation lifting `react/no-multi-comp` from a specification                                                                                              |
| `lint.plugins`         | `() => readonly Contribution[]`             | One contribution per plugin, `react` first and `jsx-a11y` second                                                                                             |
| `lint.rendered`        | `() => Contribution`                        | A relaxation excusing `.spec.tsx` and `.fixtures.tsx` from the docblock rules                                                                                |
| `lint.rules`           | `() => Contribution`                        | Six React rules, declared over `**/*.{ts,tsx}`                                                                                                               |
| `lint.runtime`         | `() => Contribution`                        | A relaxation switching `react/react-in-jsx-scope` off                                                                                                        |
| `plugin.compiler`      | `(stated?: Compiled) => readonly Layer[]`   | `react.plugin.compiler`, which appends the Babel pass to the plugins the tier built, and `react.plugin.compiler(pack)`, which gives the packer the same pass |
| `plugin.mdx`           | `(stated?: Documented) => readonly Layer[]` | `react.plugin.mdx`, which puts the MDX plugin ahead of every other, and `react.plugin.mdx(pack)`, which gives the packer the same plugin                     |
| `plugin.refresh`       | `(stated?: Refreshed) => Contribution`      | The React plugin, appended to whatever plugins the tier built                                                                                                |
| `test.cleanup`         | `() => Contribution`                        | The absolute path of `./vitest.setup.ts`, appended to `test.setupFiles`                                                                                      |
| `test.document`        | `() => Preset`                              | A preset setting `test.environment` to `happy-dom`                                                                                                           |

Note: a preset replaces the environment a tier set rather than adding to it. `react.test.document`
is a preset. A package that needs another document implementation takes the layer back by name with
`remove()` from `@stealthscale/vite-config`.

### The transform

`plugin.refresh()` compiles `.ts`, `.tsx`, `.js`, `.jsx` and `.mdx`. It leaves `/node_modules/`
alone and selects the automatic JSX runtime. Each field of `Refreshed` widens or narrows one of
those defaults. A field left undefined keeps the default.

| Field    | Type                | Default                                                        |
| -------- | ------------------- | -------------------------------------------------------------- |
| `also`   | `readonly RegExp[]` | Empty. Each pattern compiles beside the five kinds listed here |
| `except` | `readonly RegExp[]` | Empty. Each pattern joins `/node_modules/`                     |
| `from`   | `string`            | `react`, also exported as `plugin.FACTORY`                     |

Note: the automatic runtime imports the factory itself. No file under this transform needs React in
scope. `web.json` selects the default factory for the type checker, so a package that changes `from`
states the matching `jsxImportSource` in its own tsconfig.

### The compiler

`plugin.compiler()` runs the React Compiler over `.ts`, `.tsx`, `.js`, `.jsx` and `.mdx`. The
compiler reads what a component renders from and writes a memo cache around it, so the component
renders again only when one of those values has changed. A component it compiled needs no `useMemo`
and no `useCallback` for speed.

It returns two layers. `react.plugin.compiler` appends the pass to what a tier builds, and
`react.plugin.compiler(pack)` gives the packer the same pass, so a library publishes memoised
components. Without the second one a library would publish what its author wrote, and a consumer
installing it compiles nothing under `node_modules`.

The memo cache is written against the React a build resolves. React is a peer of this package, so
the version comes from the consumer's own tree and a major upgrade needs no edit anywhere. React 19
carries the runtime itself. React 17 and 18 take it from `react-compiler-runtime`, which a package
on either version installs beside React. A React newer than the compiler has a target for takes the
newest target, because every one of those carries the runtime in React. A React older than 17 fails
when the configuration is composed, naming the version it read.

`Compiled` has one field, `target`, which overrides that reading. State it where a package renders
against a React it does not install, such as a library published for a consumer on an older one.
`layers()` takes the same object in place of `true`:

```ts
export default defineConfig(import.meta.dirname, {
  extends: [react.layers({ compiler: { target: "18" } })],
});
```

A package that memoises by hand drops both layers with `compiler: false`:

```ts
export default defineConfig(import.meta.dirname, { extends: [react.layers({ compiler: false })] });
```

Warning: `useMemo` and `useCallback` still have one use the compiler does not cover. The compiler
caches against the values a component read, so the identity it returns changes when one of them
does. Write either hook where a caller depends on one identity for the whole life of a component.

The compiler runs through the Babel bridge rather than through the React plugin's own `compiler`
option. That option resolves `babel-plugin-react-compiler` from the plugin's own directory. An
isolated `node_modules` gives it no path to a package this workspace installed, so the option
compiles nothing and turns fast refresh off as well. The bridge resolves the preset from this
package, where it is declared.

Warning: a package missing `babel-plugin-react-compiler` or `@rolldown/plugin-babel` fails when its
configuration is composed, naming both. Babel resolves a preset during a transform rather than when
it is configured, so without that check the package would build clean and memoise none of it.

The layer raises the compiler's `panicThreshold` from `none` to `critical_errors`. A critical error
is the compiler failing one of its own invariants, and an unrecognised one is a case it has no
handling for. Both mean the compiler is wrong rather than the code, and the build stops on either.

A function the compiler declines on purpose is left as written and reported nowhere, which covers
every pattern it cannot prove safe to memoise. Mark such a function with the `"use no memo"`
directive, which turns a refusal the build would stop on into a decision the source records. The
server environment is left out on the same terms, excused by the preset's `applyToEnvironmentHook`.
A package that renders on the server runs that half uncompiled.

Neither layer applies where the mode is `test`. Each memo cache is a branch nobody wrote, and
coverage counts it, so a package held to full branch coverage would be asked to exercise a
compiler's caching rather than its own code. A specification reads what its author wrote. The build
is what proves the compiled form, and it fails on any error the compiler raises.

Warning: the compiler asks a Babel node path whether it is an `LVal`. Babel 8 took
`AssignmentPattern` out of that alias, so under Babel 8 the compiler refuses every
`const { a = 1 } = b` and leaves the whole function uncompiled without reporting it. The bridge
accepts either major. A repository states an override to hold the peer at 7:

```yaml
overrides:
  "@rolldown/plugin-babel>@babel/core": ^7.29.0
```

Babel 7 ships no types of its own, so a package reading the bridge's own types installs
`@types/babel__core` beside it.

### MDX

`plugin.mdx()` compiles an `.mdx` file into a component with `@mdx-js/rollup`. It returns two
layers. `react.plugin.mdx` is an override that puts the plugin ahead of every plugin the tree built:
the React Compiler runs in the same `pre` phase and fails on raw MDX when it runs first, and an
override is applied after every contribution, so the order is the same whatever a package wrote.
`react.plugin.mdx(pack)` appends the same plugin to `pack.plugins`, because the packer reads that
list and nothing under `plugins`. `layers({ mdx: true })` adds both.

`@mdx-js/rollup` is an optional peer, loaded when a plugin is constructed and not when this package
is imported. A repository that compiles no document imports the React tier with the peer absent. A
repository that states the layer without the peer is told, at the first build that constructs the
plugin, that the package is an optional peer of `@stealthscale/vite-config-react` and has to be
installed beside it. Nothing is loaded while the toolchain reads the configuration for its metadata
alone.

The plugin compiles `.mdx` and nothing else. At its own default it also claims `.md`, and a markdown
file imported with `?raw` then arrives as a component rather than as a string. `Documented` has one
field, `from`, with the same meaning and default as `Refreshed.from`. A package that changes one
changes the other.

Types come from `@types/mdx` and from `./mdx.d.ts`, which this package publishes as the `./mdx`
export. Reference it from the `globals.d.ts` the package already includes:

```ts
/// <reference types="@stealthscale/vite-config/globals" />
/// <reference types="@stealthscale/vite-config-react/mdx" />
```

The file declares the `*.mdx` module and types the elements a document renders against React's JSX.
Without it, `MDXComponents` accepts any function for any element under `@types/react` 19, because
`@types/mdx` reads a global `JSX` namespace and `@types/react` 19 declares none.

Note: a document's default export is typed. A constant it exports beside it is not, and TypeScript
reports `has no exported member`. Declare it in a sibling `<name>.d.mdx.ts`, which
`allowArbitraryExtensions` in the base tier resolves:

```ts
export { default } from "*.mdx";

export const title: string;
```

Warning: a library that re-exports an `.mdx` module from its entry gets a broken `index.d.mts` from
`vp pack`. The declaration imports its types from the JavaScript chunk. Export a document through a
`.tsx` module that imports it, and the declarations come out whole. An application has no such step
and needs no wrapper.

`@mdx-js/rollup` peers on `rollup` for one type and imports nothing from it. Left alone, the package
manager installs 5 MB of `rollup` and a native binary for a bundler nothing here runs. A repository
states two overrides in `pnpm-workspace.yaml` to drop it:

```yaml
overrides:
  "@mdx-js/rollup>rollup": "-"
  "@rollup/pluginutils>rollup": "-"
```

The formatter reads `.mdx` and wraps its paragraphs to the width the rest of the repository is
written to. The linter does not read `.mdx`.

## The tsconfig fragment and the setup file

`./web.json` is a tsconfig fragment rather than a tier. It sets one compiler option,
`"jsx": "react-jsx"`. List it after the tier in the array form of `extends`, as
`["@stealthscale/vite-config-typescript/web.json", "@stealthscale/vite-config-react/web.json"]`. The
fragment then cannot be extended without its base by mistake.

`./vitest.setup.ts` does two things. It sets `IS_REACT_ACT_ENVIRONMENT`, which React reads before it
processes an update inside `act`. It also registers one `afterEach` that unmounts every root Testing
Library rendered and then replaces the children of `document.body`, so an effect's cleanup runs and
one test never reads markup another test mounted. Reach the file through `test.cleanup()` rather
than by path. That layer resolves it by package name, and the same layer works from a workspace link
and from an installed copy.

Warning: a package that calls `act` without this setup file loads no such global. React then logs
`The current testing environment is not configured to support act(...)` on every update inside an
`act` scope, and the warning that reports an update outside `act` is never raised at all.

## Federated applications

`federation.shared()` reads the version of the React installed beside this package. It widens that
version to the whole major and marks `react` and `react-dom` as singletons at the resulting range.
Pass the result to `federation.host()` or `federation.remote()`.

```ts
federation.host({
  name: "host",
  remotes: ["remote"],
  shared: react.federation.shared(),
});
```

The range covers the major rather than the exact version. Applications on two different patches of
one major share a dispatcher safely. A narrower range would make a host refuse a remote it can in
fact run. Pass a version string to pin the result. `federation.installed()` reads the installed
version on its own.

Warning: two copies of React on one page keep separate dispatchers. A component from a remote then
calls a hook on the copy that did not render it, and React reports the call as illegal.

## Licence

MIT. See [LICENSE](LICENSE).
