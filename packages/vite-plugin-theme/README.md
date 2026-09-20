# @stealthscale/vite-plugin-theme

`@stealthscale/vite-plugin-theme` publishes two plugins. `theme.runtime()` generates the styling
runtime a design-system package publishes, from the preset that package publishes.
`theme.stylesheet()` compiles an application's stylesheet from the themes the application states and
the presets of every package on its dependency graph. A component package and a theme package add no
plugin: each writes its preset or its theme by hand.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-theme
```

The package peers on `@stealthscale/vite-plugin-base`, `vite` and `vitest`. Install all three beside
it. `engines.node` is `>=26.0.0`.

## Usage

The design-system package adds `theme.runtime()`. It publishes its preset under the `./theme`
subpath, and the plugin generates `generated/` from it as soon as the configuration resolves, so the
package's own source can import the runtime under a type checker, a packer or a test runner.

```ts
import { theme } from "@stealthscale/vite-plugin-theme";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [theme.runtime()],
});
```

An application adds `theme.stylesheet()` and states its themes in `theme.config.ts`:

```ts
import { abyss } from "@acme/theme-abyss";
import { fathom } from "@acme/theme-fathom";

export default { static: "*", themes: [fathom, abyss] };
```

The first theme is the default: its values and its extensions apply while no attribute is set. Every
theme is compiled under `[data-theme=<name>]` as well, the first included, so a subtree can take any
theme. An application that states no theme draws the foundation alone. A recipe written in the
application itself is registered through a preset the statement carries under `presets`, installed
after every package's preset and before the themes. The application imports the stylesheet through
the system package's `styles.css` subpath, and the plugin appends the compiled rules to whichever
stylesheet declares the cascade order.

## Options

`theme.stylesheet()` takes three options and `theme.runtime()` takes `layers` alone, because the
runtime is generated from the package's own preset and scans nothing. Every field is optional.

| Option          | Type                        | Default                 | Effect                                                                                              |
| --------------- | --------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `include`       | `readonly string[]`         | `["src/**/*.{ts,tsx}"]` | Globs the compiler scans, relative to the application, beside every workspace package it depends on |
| `layers`        | `Partial<StylesheetLayers>` | Each role's own name    | The name each cascade layer goes by, in the compiler and in the stylesheet alike                    |
| `systemPackage` | `string`                    | `@stealthscale/theme`   | The package that publishes the foundation and generates the runtime                                 |

Everything else is a convention rather than an option: the statement is `theme.config.ts`, a preset
is published under `./theme`, the runtime goes to `generated/`, and the rendered configurations go
to `node_modules/.theme/`.

## Reference

| Export             | Signature                              | What it returns                                                             |
| ------------------ | -------------------------------------- | --------------------------------------------------------------------------- |
| `theme.runtime`    | `(options?: RuntimeOptions) => Plugin` | `stealth:theme.runtime`, which generates the runtime of the system package  |
| `theme.stylesheet` | `(options?: Options) => Plugin`        | `stealth:theme.stylesheet`, which compiles the stylesheet of an application |

| Type               | What it describes                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `Application`      | What an application states: `themes`, the first being the default, an optional `presets` and an optional `static` |
| `Theme`            | A theme as a theme package exports it: `name`, `variant`, an optional `preset` and `fonts`                        |
| `Options`          | The three options above                                                                                           |
| `RuntimeOptions`   | The `layers` option alone                                                                                         |
| `Switchable`       | A theme read for its `name` and its `preset`                                                                      |
| `SwitchablePreset` | A preset read for its `name`, its `presets` and the extensions under `theme.extend`                               |
| `Extension`        | What a theme changes about one recipe: `base`, `variants` and `compoundVariants`                                  |
| `Extensions`       | A theme's extensions, under `recipes`, `slotRecipes`, `textStyles`, `layerStyles` and `animationStyles`           |

## The compilation

The statement and every contributor's preset are imported through Vite, under the export conditions
the application resolves with, so a workspace package resolves to its source. Under a dev server the
import goes through the server's runner and joins its module graph. Every value is then written into
the compiler's configuration as a literal, because the compiler's own loader resolves a workspace
package to built output. The one import the rendered configuration keeps is the compiler's base
preset, by absolute path.

A contributor is a package on the application's dependency graph that publishes `./theme` and names
the system package as a dependency or a peer. A package from outside the design system that
publishes an export of that name is passed over. The system package is installed first, and each
other package after the packages it depends on, so a package building on another can extend it. The
first theme's values and preset are installed next, unscoped. Then every theme's recipe extensions
and its text, layer and animation styles are nested under `[data-theme=<name>] &`, one preset per
level of the theme's lineage, so the compiler emits a rule that applies while the attribute is set
and matches nothing while it is not. A theme's global styles and keyframes have no rule to nest
under the attribute, so only the first theme's apply.

Every color stated in both modes, in the foundation, a preset or a theme, is rendered as one
`light-dark(light, dark)` value before the compiler reads it. The browser evaluates the function
where the color is used, against the `color-scheme` of that element, which the foundation's global
styles set from the color mode attribute and the reader's preference. A custom property holding the
function is inherited unevaluated, so an alias of one and a chain of aliases evaluate at the use
site too, and a subtree switched to either mode inside the other reads every color from its own
mode. A color stated once, or one naming a condition beside the two modes, is written as it is. The
multi-theme example's stylesheet falls from 654 to 487 kB, and from 80 to 45 kB gzipped.

The compiler emits the theme attribute under its own name and signs the root element. Both are
rewritten before the rules reach the stylesheet, so nothing on the page names the compiler.

The rules are compiled once per change however many stylesheets declare the cascade order, and the
compiler's diagnostics are reported once with them.

## What is watched

A change to the statement, a theme, a preset or a manifest restarts the compiler. A file that
appears, changes or is deleted under the scanned globs is passed to the running compiler, which
reads it from disk itself. Anything else is left to Vite. Under a dev server, every stylesheet the
rules were appended to is invalidated on either, so the next request retransforms it. Under a build
that watches, the same changes reach the plugin through `watchChange`, and the rebuild compiles from
the changed compiler.

A dev server watches its own root and the files a plugin names. The source directory of every
workspace package the compiler scans is handed to the watcher as well, so a file added to a package
beside the application reaches the compiler without a restart.

## Diagnostics

Whatever the compiler could not parse is reported through the bundler as one warning per compile,
with the severity, the code, the message, the file and the help the compiler offered. An application
whose graph names no package publishing a preset beside the system package is warned about too,
because its stylesheet carries the foundation's values and no component's rules.

## Licence

MIT. See [LICENSE](LICENSE).
