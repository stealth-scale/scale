# @stealthscale/vite-plugin-product

`@stealthscale/vite-plugin-product` composes a product from its plugins while the product builds. It
checks every installed plugin against the others, serves the resolved product as `virtual:product`,
builds each plugin's lazy modules into a chunk of its own, and writes the catalogues the product's
services read.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-product
```

The package peers on `vite`, `@stealthscale/sdk-core`, `@stealthscale/vite-plugin-base` and
`@stealthscale/vite-plugin-i18n`. A product adds it through `@stealthscale/vite-config-product`,
beside the layers of `@stealthscale/vite-config-i18n`.

## Usage

The product states its plugins in `src/product.ts`, whose default export is the definition:

```ts
import { defineProduct, installed } from "@stealthscale/sdk-core";
import { manifest as timeOff } from "@acme/plugin-time-off";

export default defineProduct({
  name: "product.name",
  plugins: [installed(timeOff)],
  productId: "people",
  version: "1.4.0",
});
```

The application reads the resolved product from `virtual:product`:

```ts
import { product } from "virtual:product";
```

Add the module's type with a triple-slash directive from a file the project compiles:

```ts
/// <reference types="@stealthscale/vite-plugin-product/client" />
```

`product({ definition })` names another module. `src/product.ts` is the default.
`product({ standalone })` serves the standalone page of a plugin, described in
[The standalone page](#the-standalone-page).

## The composition

When a build or a dev server starts, the plugin composes the product:

1. It imports the definition through a Vite environment of its own, with `noExternal: true` and the
   application's server conditions. Every module the import reads is evaluated there, so a contract
   and a manifest entry load in Node without React.
2. It finds each installed plugin's web package and contract package among the modules the import
   evaluated. The package that contains the first module to export the manifest, in evaluation
   order, is the web package. The same rule finds the contract package. A manifest the definition
   builds itself, which no module exports, belongs to the definition module's package. No package is
   imported for the search alone.
3. It leaves out a web package outside the product's own package and its dependencies. The resolver
   then reports the plugin.
4. It reads the words from the `stealth:i18n` plugin: the fallback language's catalogue of each
   namespace, and the packages that publish each one. The plugin's contract package and the
   application's own catalogues are left out of the publishers.
5. It calls `resolveProduct` with the definition, the web packages, the words and the
   `validateHotkey` of `@tanstack/hotkeys` 0.10.0, the version `@tanstack/react-hotkeys` binds keys
   with.

A configuration without the `stealth:i18n` plugin fails the build and names
`@stealthscale/vite-config-i18n`.

## Faults

A build that finds a problem fails with every problem as `<path>: <reason>`, followed by a hint for
each contract package whose catalogues the i18n layer does not follow. The hint states the scope to
add. The bundler prints each warning, and the build continues.

Under a dev server, `virtual:product` serves the last product that resolved. It throws the problems
while no product has resolved yet.

A definition that fails to load fails with its error and the rule a web package's main entry
follows: it imports its components and React through lazy importers alone. A definition without an
object as its default export fails and names the file.

## Chunks

The plugin adds one code-splitting group, at priority 4: above the shared group and below the vendor
group of `@stealthscale/vite-config`. The group assigns every module of an installed plugin's web
package to the chunk `plugin-<id>`, so each plugin's pages, extensions, commands and settings
sections build into one chunk. A module that an entry imports statically is left out of the group.
The web package's main entry and its manifest load with the entry chunk.

## Catalogues

The client environment of a build writes three files under `.product` in its output:

| File                       | Contains                                                  |
| -------------------------- | --------------------------------------------------------- |
| `.product/access.json`     | Every permission, resource kind, role and entitlement     |
| `.product/flags.json`      | Every flag, one kill switch per installed plugin included |
| `.product/operations.json` | Every query and mutation, in the order of the plugins     |

Each description is translated into every language the declaring plugin's catalogues contain. The
access and flag lists are sorted by qualified id. A dev server and a server environment write none.

## Changes on a dev server

The plugin watches every file the composition read. A change to one of them composes the product
again:

- Under a dev server that serves one module per file, `hotUpdate` invalidates `virtual:product` and
  reloads the page.
- Under a dev server that bundles, `watchChange` reloads the page. `virtual:product` lists every
  composition file as a watched file, so the rebuild loads it again.
- A composition with problems shows them in the error overlay and keeps the last product that
  resolved.
- One composition runs at a time, in the order of the changes. The changes reported during a
  composition compose the product once more after it ends.
- Every composition imports the definition through one environment, which the plugin closes when the
  bundle closes. A composition after a change transforms only the changed files again: 18 ms at 30
  plugins and 45 ms at 100, measured on generated products.

A watching build composes the product again at its next build start.

## The standalone page

`product({ standalone })` serves a plugin's standalone page from the plugin's own web package. The
package adds it through `product.standalone()` of `@stealthscale/vite-config-product`, which applies
it under a dev server alone.

- Once the configuration resolves, the plugin writes the definition of the product that runs the
  plugin to `node_modules/.stealth/standalone/product.ts`. The definition passes the module that
  `manifest` names, `src/manifest.ts` by default, and each contract package in `beside` to
  `standaloneFrom` of `@stealthscale/sdk-host/standalone`. The plugin leaves a definition with the
  same source untouched, so the watcher does not report a change. Where `definition` names a module,
  the plugin writes none and composes that module.
- The definition module's package is the web package of the plugin, and of each plugin installed
  from its contract alone.
- The plugin serves the page's document as `index.html` at the project root, and its entry as
  `virtual:standalone`. The entry imports `@stealthscale/theme/styles.css`. It loads `virtual:i18n`,
  `virtual:product`, `@stealthscale/sdk-host/standalone/app` and the module `glyphs` names through
  `import()`, then calls `renderStandalone` with the page's `locales` and `themes`.
- The page loads the definition as `virtual:standalone-product`, the generated source with the
  manifest module imported from the project root. An application's chunks place every module under
  `node_modules` in the vendor chunk, and the generated file there would import the entry chunk that
  imports it.
- The entry runs every component after the React refresh runtime installs. The bundling dev server
  installs the runtime in the entry's own body, after the chunks the entry imports statically, and
  the bundler may move a component the entry shares with a lazy module into such a chunk.
- A server that bundles serves the document at every address without a file on disk. A server that
  serves one module per file reads `index.html` from disk, so it does not serve the page.

## Licence

MIT. See [LICENSE](LICENSE).
