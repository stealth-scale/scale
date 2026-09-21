# @stealthscale/scale

[![ci](https://github.com/stealth-scale/config/actions/workflows/ci.yml/badge.svg)](https://github.com/stealth-scale/config/actions/workflows/ci.yml)
[![release](https://github.com/stealth-scale/config/actions/workflows/release.yml/badge.svg)](https://github.com/stealth-scale/config/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/v/@stealthscale/theme?label=%40stealthscale%2Ftheme)](https://www.npmjs.com/package/@stealthscale/theme)
[![node](https://img.shields.io/node/v/@stealthscale/theme)](https://nodejs.org)
[![license](https://img.shields.io/github/license/stealth-scale/config)](LICENSE)

`@stealthscale/scale` publishes the packages a stealthscale application is built from: the design
system every interface is drawn with, the component libraries built on it, and the providers an
application renders. It also publishes the configuration tiers that build and release every package
here, and the testing kits that check each package against its contract.

## What is here

| Directory      | What it contains                                                                  |
| -------------- | --------------------------------------------------------------------------------- |
| `foundations/` | The theme, the hooks, the settings store and the providers an application renders |
| `components/`  | The component libraries, one package for each kind of thing a page draws          |
| `themes/`      | The published themes, each drawn from four colors stated outright                 |
| `packages/`    | The build tiers, the bundler plugins and the testing kits                         |
| `examples/`    | Private applications that each demonstrate one decision                           |
| `docs/`        | The decision records, the design proposals and the writing standards              |

## The contract

A package extends the tier it is built on and states what is true only of itself.

```ts
import { define, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [define.manifest(), server.port(4200)],
});
```

Layers listed in `extends` compose first. Keys written beside `extends` are merged over the result
and win. The `extends` key itself never reaches Vite.

Declare the directory rather than discovering it. Under `vp test` the working directory is the
workspace root. A configuration runs from a bundled temporary file outside the package it
configures. `import.meta.dirname` names the directory from there and nothing else does.

## The packages

| Package                                                     | What it does                                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`vite-config-core`](packages/vite-config-core)             | Defines the four kinds of layer and composes a list of them into one Vite configuration                    |
| [`vite-config`](packages/vite-config)                       | Publishes the five tiers and a namespace of layers for each part of a Vite configuration                   |
| [`vite-config-typescript`](packages/vite-config-typescript) | Publishes the three TypeScript configurations a package extends: base, node and web                        |
| [`vite-config-plain`](packages/vite-config-plain)           | Packs and tests the kernel and the two plugins that every tier depends on                                  |
| [`vite-config-react`](packages/vite-config-react)           | Adds the JSX transform, the React lint rules, the DOM a test renders into and the MDX compiler             |
| [`vite-config-css`](packages/vite-config-css)               | Adds the Stylelint rules a stylesheet is checked against and the plugin that runs them                     |
| [`vite-config-theme`](packages/vite-config-theme)           | Adds the runtime generator to a design-system package and the stylesheet compiler to an application        |
| [`vite-config-i18n`](packages/vite-config-i18n)             | Adds the catalogue plugin to a package and puts the words its specifications read in scope                 |
| [`vite-plugin-base`](packages/vite-plugin-base)             | Supplies the typed plugin and the module-graph readers every bundler plugin here is built on               |
| [`vite-plugin-sbom`](packages/vite-plugin-sbom)             | Writes a CycloneDX bill of materials from the modules a build reached                                      |
| [`vite-plugin-theme`](packages/vite-plugin-theme)           | Generates the styling runtime of a design system and compiles the stylesheet of an application             |
| [`vite-plugin-i18n`](packages/vite-plugin-i18n)             | Finds every catalogue an application can reach, types their keys and returns the module that loads them    |
| [`pandacss-naming`](packages/pandacss-naming)               | Writes the class names of a design system in one readable scheme, for the stylesheet and the browser alike |
| [`pandacss-compiler`](packages/pandacss-compiler)           | Renames a compiled stylesheet and its generated runtime into that scheme                                   |
| [`testing`](packages/testing)                               | Builds the scratch workspaces and manifests a specification runs a tree from                               |
| [`testing-react`](packages/testing-react)                   | Reads a rendered component through the part names and data attributes on its anatomy                       |
| [`testing-router`](packages/testing-router)                 | Mounts a route tree in a specification and renders the page a path matches                                 |
| [`testing-config`](packages/testing-config)                 | Checks a config, plugin or library package against the contract its kind keeps                             |
| [`testing-theme`](packages/testing-theme)                   | Checks a theme, a recipe or a preset against the theme contract and the contrast table                     |

## The design system

| Package                            | What it does                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`theme`](foundations/theme)       | Publishes the foundation every recipe is written against, the runtime every component binds with, and the vocabulary a theme is written in |
| [`hooks`](foundations/hooks)       | Reads the page a component draws into: how the page is read, what it measures, and what a value was on the previous render                 |
| [`settings`](foundations/settings) | Stores one named setting, restricted to the values it may take and kept in the store the reader chooses                                    |

A recipe is written against the foundation's vocabulary alone. That vocabulary resolves to the same
values in a browser and in node, so a component and a configuration read one source. Two calls fill
the contract, and a theme overrides whichever values it chooses. The build plugin compiles one
stylesheet from every preset and theme in the dependency graph, and scopes each theme under
`data-theme`. It renames the classes into the naming scheme, so the page receives `button--lg`
rather than the compiler's own name.

### The providers

| Package                                                     | What it puts in scope                                                                                                       |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`provider-shell`](foundations/providers/shell)             | Every provider below it, each rendered in the order it depends on the one before                                            |
| [`provider-router`](foundations/providers/router)           | The routes an application navigates by, and the options every router starts from                                            |
| [`provider-color-mode`](foundations/providers/color-mode)   | The colour mode, kept across visits, with the first paint settled before the page draws                                     |
| [`provider-locale`](foundations/providers/locale)           | The locale a page is read in, kept across visits, with the text direction that follows from it                              |
| [`provider-i18n`](foundations/providers/i18n)               | The words an application is read in, in the locale it is given                                                              |
| [`provider-form`](foundations/providers/form)               | The contexts a bound field and a bound form share, the engine that reads a JSON Schema, and the draft kept across a refresh |
| [`provider-hotkeys`](foundations/providers/hotkeys)         | The keyboard shortcuts a page responds to                                                                                   |
| [`provider-viewport`](foundations/providers/viewport)       | A stated width for a subtree rather than the window's, and which breakpoint it is at                                        |
| [`provider-environment`](foundations/providers/environment) | The document a subtree belongs to, which a portal attaches to and a measurement is taken against                            |

### The components

Every component binds a recipe and draws nothing of its own. A theme restyles every component by
extending its recipe. Each package publishes a preset under `./theme` that registers its recipes
with an application's compiler.

| Package                               | What it draws                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`typography`](components/typography) | `Heading`, `Text`, `Blockquote`, `Code`, `Kbd`, `List` and `Icon`: the components that are text         |
| [`layout`](components/layout)         | `Container`, `Stack`, `Grid`, `Frame`, `Divider` and `Spacer`: arranging what is already there          |
| [`actions`](components/actions)       | `Button` and `IconButton`: what a person presses                                                        |
| [`disclosure`](components/disclosure) | `Collapsible`, `Tabs`, `Tooltip`, `Popover` and `Menu`: what is shown and hidden on the reader's say-so |
| [`navigation`](components/navigation) | `Link` and `Breadcrumb`: the ways a person moves between places                                         |
| [`forms`](components/forms)           | `Input` and `SearchInput`: the controls a person fills in                                               |
| [`feedback`](components/feedback)     | `Skeleton`, `SkeletonText` and `EmptyState`: the system reporting on itself                             |
| [`data`](components/data)             | `Badge`: a single value drawn for reading                                                               |
| [`a11y`](components/a11y)             | `SkipNav`, `RovingFocus` and `VisuallyHidden`: what a keyboard and a screen reader need                 |
| [`primitives`](components/primitives) | `Portal`: where a subtree is drawn, drawing nothing itself                                              |

`collections`, `content`, `modals`, `screen` and `surfaces` are declared and still empty.

### The themes

Ink is the look the components were drawn against: charcoal on paper with a blue accent, on the
foundation's own greys. Every other theme is drawn from four colors stated outright: a page and an
ink for each mode, and the colors the palettes are drawn from. Every other value is a tint or a mix
of the four, drawn with `inked`, `hues` and `scaleOf` from the foundation's authoring entry. The
specifications check the contract and the steps a reader has to tell apart, and leave the contrast
checks out with the reason beside the skip: a theme keeps its colors as stated. An application lists
a theme in `theme.config.ts` and a page switches to it with `data-theme`.

| Package                             | What it draws                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| [`theme-ink`](themes/ink)           | Charcoal on paper by day, paper on charcoal after dark, and a blue accent              |
| [`theme-cinder`](themes/cinder)     | A red product on slate and ash, with sharp corners and hard shadows                    |
| [`theme-harbour`](themes/harbour)   | A steel blue product on navy and mist                                                  |
| [`theme-admiral`](themes/admiral)   | A teal blue product on navy and chalk                                                  |
| [`theme-regatta`](themes/regatta)   | A crimson product with deep blue and teal beside it, on navy after dark, sharp corners |
| [`theme-pine`](themes/pine)         | A green product with teal and sage beside it, on the night after dark                  |
| [`theme-carnival`](themes/carnival) | A red product with orange and yellow beside it, on navy after dark and on cream by day |
| [`theme-dusk`](themes/dusk)         | A coral product with mauve and plum beside it, on navy after dark, with soft corners   |
| [`theme-neon`](themes/neon)         | A violet product with hot pink and yellow beside it, on grape after dark, soft corners |
| [`theme-blush`](themes/blush)       | A pink product on navy and pearl, with round corners                                   |

## The tiers

`@stealthscale/vite-config` publishes five tiers under `./preset/*`. A package extends exactly one.

| Tier               | For                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `preset/base`      | A published package that commits to no runtime. Neither node's globals nor the browser's are in scope    |
| `preset/node`      | A published package that runs on node                                                                    |
| `preset/web`       | A published package that runs in a browser. A test runs against a DOM                                    |
| `preset/app`       | A browser application that is deployed rather than published                                             |
| `preset/workspace` | A repository root. The node tier, plus the task cache, the `ci` task, the staged checks and the projects |

An add-on configuration package exports `layers()` for a package and `workspace()` for a root. A
package that renders adds `react.layers()` beside its tier. A package with stylesheets adds
`css.layers()`. A design-system package and an application that uses one add `theme.layers()`.

The tiers build on the kernel and the two bundler plugins. All three pack under
`@stealthscale/vite-config-plain` rather than extending a tier.

## Layers

| Kind         | What it does                         | When it runs                         |
| ------------ | ------------------------------------ | ------------------------------------ |
| `preset`     | Sets configuration keys outright     | First, ordered by `enforce`          |
| `contribute` | Appends one item to a list at a path | After every preset, in written order |
| `remove`     | Takes a layer back by name           | Matches the nearest layer above it   |
| `override`   | Rewrites the merged configuration    | Last                                 |

A layer takes the name of the call that made it. `server.port(4200)` returns a layer named
`server.port(4200)`. A removal targets that name. A contribution, a removal and an override each
require a `because`. The conformance check rejects an empty one. A preset requires none. Its reason
belongs to the package that states it.

Note: the linter and the formatter read the workspace root only. A `lint` or `fmt` layer written in
a package composes and merges like any other. Both tools then ignore it.

## The examples

| Example                                           | What it shows                                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`app-host`](examples/app-host)                   | An application that loads another one at run time through Module Federation                    |
| [`app-remote`](examples/app-remote)               | An application built to be loaded by another one                                               |
| [`router-basic`](examples/router-basic)           | Routing an application whose every address is known when it is built                           |
| [`router-declared`](examples/router-declared)     | Routing pages that arrive as data, under layouts they name and linked to by id                 |
| [`router-guarded`](examples/router-guarded)       | Routing only where a condition holds, answering not-found where it does not                    |
| [`router-federated`](examples/router-federated)   | Routing to pages another deployment declares, at the addresses it states                       |
| [`app-react`](examples/app-react)                 | What the React configuration package adds to an application that renders                       |
| [`app-web`](examples/app-web)                     | A pinned port and a proxied path, with no framework in the page                                |
| [`app-ssr`](examples/app-ssr)                     | Server-side rendering and the dependency the server bundle has to contain                      |
| [`app-worker`](examples/app-worker)               | Arithmetic on a worker thread that the dependency scan finds                                   |
| [`lib-bare`](examples/lib-bare)                   | A library that takes the workspace root's configuration                                        |
| [`lib-core`](examples/lib-core)                   | A library that reaches for neither node's globals nor the browser's                            |
| [`lib-node`](examples/lib-node)                   | A library published for node                                                                   |
| [`lib-cli`](examples/lib-cli)                     | A library that installs a command named for what it does                                       |
| [`lib-tokens`](examples/lib-tokens)               | A pack hook that writes part of what the library ships                                         |
| [`lib-ui`](examples/lib-ui)                       | A component library four of the example applications share                                     |
| [`lib-actions`](examples/lib-actions)             | A button drawn by a recipe, with the preset that registers it                                  |
| [`lib-surfaces`](examples/lib-surfaces)           | A card of four parts drawn by one slot recipe, with the preset that registers it               |
| [`form-fields`](examples/form-fields)             | The field components the form examples share, bound to the form foundation                     |
| [`form-basic`](examples/form-basic)               | A contact form drawn from a JSON Schema, read from a catalogue in two languages                |
| [`form-rules`](examples/form-rules)               | A format and a keyword in the engine, a field that asks a server, and a rule across two fields |
| [`form-presentation`](examples/form-presentation) | A form drawn from the presentation its schema carries, through a renderer registry             |
| [`form-draft`](examples/form-draft)               | A form in two steps that keeps a draft across a refresh and leaves the password out of it      |
| [`theme-fathom`](examples/theme-fathom)           | A deep teal theme on marine greys, rounder than the foundation                                 |
| [`theme-folio`](examples/theme-folio)             | An editorial theme with a violet brand and a serif to read it in                               |
| [`theme-forge`](examples/theme-forge)             | A warm console theme with cream surfaces, an amber brand and flat shadows                      |
| [`theme-abyss`](examples/theme-abyss)             | A theme derived from another one rather than from the foundation                               |
| [`theme-single`](examples/theme-single)           | A page in one theme that switches its color mode                                               |
| [`theme-multiple`](examples/theme-multiple)       | A page that switches between four themes and two color modes                                   |

## Working on it

```bash
pnpm install
pnpm run ready
```

`ready` runs `bootstrap` and then `vp run ci`. `bootstrap` packs the configuration packages and
every workspace package they depend on, in dependency order: nineteen of the ninety, which is what
the task runner needs to read every configuration and construct the plugins a build runs. Every
example and every package imports the configuration by name and resolves through `dist`, exactly as
a repository installing from npm does. A clean checkout has no `dist` yet, and the task graph builds
everything else once, in one run. `pnpm gate:bootstrap` proves that from a checkout with no built
output, and proves that a second run of the graph hits the cache on every task.

After the bootstrap, `vp run ci` runs `vp run -r build`, then `vp check`, then `vp test --run`. The
task runs all three every time. A green run means all three passed. Put a flag for the runner before
the task name. Anything after the task name goes to the task. `vp run -v ci` is verbose, while
`vp run ci -v` passes `-v` to `vp test`.

`pnpm focus` runs the tests of the package it is run in once with coverage off, and `pnpm watch`
keeps them running. The coverage policy stays with `vp test` and the gate. `pnpm trust:plan` reads
the workspace and the registry and prints what publishing and trusting every public package would
take, `pnpm trust:apply --yes` runs that plan, and `pnpm trust:test` checks the planner against a
stand-in registry offline.

[CONTRIBUTING.md](CONTRIBUTING.md) covers the pull request, the changeset and the three standards
under [docs/standards/](docs/standards/). The [architecture decision records](docs/adr/) record what
every package here inherits and what each decision cost. The [RFCs](docs/rfc/) set out the designs
that were argued before they were accepted. [SECURITY.md](SECURITY.md) covers how to report a
vulnerability.

## Licence

MIT. See [LICENSE](LICENSE).
