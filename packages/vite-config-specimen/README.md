# @stealthscale/vite-config-specimen

`@stealthscale/vite-config-specimen` configures the three places a specimen is read from: the
package that holds one, the application that shows a catalogue of them, and the workspace root they
sit under.

## Install

```bash
pnpm add -D @stealthscale/vite-config-specimen
```

The package peers on `@stealthscale/vite-plugin-specimen`, `@stealthscale/vite-config`,
`@stealthscale/vite-config-core` and `vite`.

## A package that holds specimens

Add `specimen.layers()` to whichever tier the package already builds on.

```ts
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.layers(), specimen.layers()],
});
```

It stops counting `**/*.specimen.tsx` towards the package's coverage. A specimen declares a page for
the catalogue to draw rather than behaviour to assert, so it is an entry point in the way an
application's `main` is. A package that keeps its specimens elsewhere names its own globs:
`specimen.layers(["src/pages/**/*.specimen.tsx"])`.

## An application that shows a catalogue

Add `specimen.catalogue()` to whichever tier the application already builds on.

```ts
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),
    specimen.catalogue({ patterns: ["../../components/*/src/**/*.specimen.tsx"] }),
  ],
});
```

`patterns` has no default. A pattern resolves against the application root, and an application that
shows a catalogue of a workspace's components sits beside those components rather than above them.

State `props` to have each page carry what its components accept, resolved out of their types. Left
out, nothing loads a compiler. Every member of `Options` reaches the plugin as written, and the
plugin's README documents what a page then gets.

`catalogue()` adds the index plugin, and every specimen as an entry the dependency scan walks before
the server starts. A specimen is reached through a dynamic import the scan does not follow, so
without the entries the first page a reader opens re-optimises and reloads the catalogue.

Naming the entries stops Vite working the entries out for itself, which is why `**/*.html` is named
beside them.

## The stylesheet a catalogue needs

An application drawn on `@stealthscale/theme` states `static: "*"` in its `theme.config.ts`.

```ts
export default { static: "*", themes: [graphite] } satisfies Application;
```

The compiler extracts a value written as a JSX literal and nothing it reads from a prop. A scene
draws its axis as `<Button variant={one}>`, so without this the compiler emits no rule for any value
a matrix draws, and the page renders every look, size and status identically.

Measured on the button: 21 recipe classes reach the page and 7 have rules until `static` is set. A
product application states nothing and ships only the rules its own source asks for.

## The workspace root

Add `specimen.workspace()` to the root configuration.

```ts
import * as specimen from "@stealthscale/vite-config-specimen";
import { defineConfig } from "./packages/vite-config/src/preset/workspace.ts";

export default defineConfig(import.meta.dirname, { extends: [specimen.workspace()] });
```

The linter runs from the workspace root and reads the root's configuration and no other, so a
relaxation stated in a package would compose, merge, and never be read.

Four rules come off `**/*.specimen.tsx`:

| Rule                           | Why                                                              |
| ------------------------------ | ---------------------------------------------------------------- |
| `no-default-export`            | A specimen is read through its default export                    |
| Doc comments and the size caps | A specimen is as long as the scenes it takes to show a component |
| `react/only-export-components` | The default export is a page description, not a component        |
| `react/no-multi-comp`          | A scene is built from the components that arrange it             |

Pass a list to cover different files: `workspace(["components/**/*.specimen.tsx"])`.

## Licence

MIT. See [LICENSE](LICENSE).
