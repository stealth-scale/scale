# @stealthscale/vite-config-product

`@stealthscale/vite-config-product` configures an application composed from plugins and the
standalone page of a plugin. It also lints the contract package and the web package of a plugin.

## Install

```bash
pnpm add -D @stealthscale/vite-config-product
```

The package peers on `@stealthscale/vite-config`, `@stealthscale/vite-config-theme`,
`@stealthscale/vite-plugin-product` and `vite`.

## Usage

An application composed from plugins adds `product.layers()` beside the i18n layers:

```ts
import * as i18n from "@stealthscale/vite-config-i18n";
import * as product from "@stealthscale/vite-config-product";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [i18n.layers({ scopes: ["@acme", "@stealthscale"] }), product.layers()],
});
```

A plugin's contract package and web package each add their lint layer:

```ts
import * as product from "@stealthscale/vite-config-product";
import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname, {
  extends: [product.lint.plugin.contract()],
});
```

A plugin's web package adds `product.standalone()` to serve its standalone page under `vp dev`:

```ts
import * as i18n from "@stealthscale/vite-config-i18n";
import * as product from "@stealthscale/vite-config-product";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),
    i18n.layers({ scopes: ["@acme", "@stealthscale"] }),
    product.lint.plugin.web(),
    product.standalone({ beside: ["@acme/billing-contract"], themes: ["ink"] }),
  ],
});
```

## Reference

### Blocks

| Block  | What it configures                                             |
| ------ | -------------------------------------------------------------- |
| `lint` | The imports a plugin's contract package and web package refuse |

### Layers

| Export                 | Signature                                           | What it returns                                                                                                 |
| ---------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `layers`               | `(options?: ProductOptions) => readonly Layer[]`    | `product.composed`, then `product.definition`, which excuses the definition module's default export             |
| `composed`             | `(options?: ProductOptions) => Contribution`        | The product plugin, appended to `plugins`                                                                       |
| `standalone`           | `(options?: StandaloneOptions) => readonly Layer[]` | `product.standalone`, `.stylesheet`, `.chunks` and `.bundled`, then `product.standalone.definition` where named |
| `lint.plugin.contract` | `(options?: ContractLinting) => Contribution`       | One override on `src/**` that refuses every import of a contract but the ones it admits                         |
| `lint.plugin.web`      | `(options?: WebLinting) => readonly Layer[]`        | The sources' override, then the manifest entry's                                                                |

`ProductOptions.definition` names the definition module, `src/product.ts` by default.

### The standalone page

`product.standalone()` serves a page that runs the plugin under a real host. The page installs each
contract package in `beside` from its contract alone, and renders the development panel of
`@stealthscale/sdk-host` over the page. Every option is optional:

| Option       | Type                             | Default               | Effect                                                                            |
| ------------ | -------------------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `beside`     | `readonly string[]`              | `[]`                  | Contract packages the page installs beside the plugin, from their contracts alone |
| `definition` | `string`                         | The generated module  | A definition module the author writes, in place of the generated one              |
| `glyphs`     | `string`                         | None                  | A module whose `glyphs` export the settings forms and the panel render            |
| `locales`    | `readonly [string, ...string[]]` | `["en-US"]`           | The locales the page offers, the first its fallback                               |
| `manifest`   | `string`                         | `src/manifest.ts`     | The module that exports the plugin's manifest                                     |
| `themes`     | `readonly string[]`              | The application's one | The themes the page offers, by the names `theme.config.ts` gives them             |

The layers apply under a dev server alone. A build and a specification run of the package take none
of them, so a pack or a test compiles no stylesheet:

- `product.standalone` adds the product plugin with the page. The plugin writes the definition to
  `node_modules/.stealth/standalone/product.ts` once the configuration resolves. It serves the
  page's document at `/` and at every address without a file on disk.
- `product.standalone.stylesheet` compiles the page's stylesheet from `theme.config.ts`, as an
  application's stylesheet compiles. A package without the file renders the foundation alone.
- `product.standalone.chunks` adds an application's chunk groups, which place each module by its
  path. The plugin's chunk then contains its lazy modules alone, and no component runs before the
  React refresh runtime is installed.
- `product.standalone.bundled` serves the page from one bundle. The server that serves one module
  per file reads `index.html` from disk, and the page has no file.

The package's own configuration supplies the rest of what the page needs:

- The i18n layers, whose `stealth:i18n` plugin the product plugin reads the words from.
- The React layers, for the plugin's pages.
- `@stealthscale/sdk-host` with its peers, and `@stealthscale/theme`, among the package's
  devDependencies.

### The contract package

`lint.plugin.contract()` refuses every import in `src/**` but these:

- `@stealthscale/sdk-core` and `@standard-schema/spec`.
- Another contract package, which the layer recognises by the `-contract` ending of its name. A deep
  import into one is refused.
- The package's own modules: `#package.json`, a `#` import and a `./` import.
- The Standard Schema libraries in `schemas`, with their subpaths. `arktype`, `valibot` and `zod`
  are the default.

The build loads a contract in Node, and so does every product that installs the plugin.

### The web package

`lint.plugin.web()` refuses `@stealthscale/sdk-host` to every module in `src/**`, because a plugin
reads the host through `@stealthscale/sdk-plugin`. It also refuses a static import of a `.tsx`
module to the manifest entry, `src/manifest.ts` by default, and admits a lazy `import()` of one. The
build loads the manifest entry in Node.

Both layers leave out `*.spec.ts`, `*.spec.tsx`, `*.fixtures.ts` and `*.fixtures.tsx`. Each override
restates the house's refusal of `vite-plus`, because an override replaces the options the rule has
for its files. The linter checks a dynamic `import()` against the same patterns, except where a
pattern names the imported bindings.

## Licence

MIT. See [LICENSE](LICENSE).
