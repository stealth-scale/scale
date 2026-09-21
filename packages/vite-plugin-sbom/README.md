# @stealthscale/vite-plugin-sbom

`@stealthscale/vite-plugin-sbom` writes a CycloneDX 1.7 bill of materials for a build. The component
list is read from the finished module graph rather than from a manifest, so a package that is
installed and never imported is absent from the document. A component is keyed by its package URL,
and that same URL is its `bom-ref`, so a dependency edge points at the string an advisory database
matches on.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-sbom
```

The package peers on `@stealthscale/vite-plugin-base`, `vite` and `vitest`. Install all three beside
it.

## Usage

```ts
import { sbom } from "@stealthscale/vite-plugin-sbom";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sbom()],
});
```

A task runner starts a build from the workspace root, so the package being described is taken from
the bundler's resolved root rather than from the working directory. The plugin writes
`cyclonedx/bom.json` into the output directory.

Every field is optional, and no field is read off another. An application build states all five:

```ts
sbom({
  paths: ["cyclonedx/bom.json", ".well-known/sbom"],
  serialNumber: mode === "production",
  supplier: { name: "Stealth Scale B.V.", url: ["https://stealthscale.io"] },
  timestamp: mode === "production",
  type: "application",
});
```

The build is serialised once and the same bytes go to each path, so a copy served from a deployment
and a copy taken out of the output tree can never disagree.

## Options

`sbom` and `written` both take a `Described` record.

| Option         | Type                         | Default                  | Effect                                                          |
| -------------- | ---------------------------- | ------------------------ | --------------------------------------------------------------- |
| `paths`        | `readonly string[]`          | `["cyclonedx/bom.json"]` | Where the document is emitted, relative to the output directory |
| `serialNumber` | `boolean`                    | `false`                  | Writes a random URN naming this one build                       |
| `supplier`     | `Supplier`                   | None                     | Names the organisation that supplied the build                  |
| `timestamp`    | `boolean`                    | `false`                  | Records the moment the document was written                     |
| `type`         | `"application" \| "library"` | `"library"`              | Whether the subject is deployed or installed                    |

Omit `supplier` and the document includes no supplier at all. Both fields of a stated supplier are
required.

| Field  | Type                | Default  | Effect                                                      |
| ------ | ------------------- | -------- | ----------------------------------------------------------- |
| `name` | `string`            | Required | The organisation's name, written into the document as given |
| `url`  | `readonly string[]` | Required | Each address a consumer can reach the organisation at       |

Note: `serialNumber` and `timestamp` are the only two fields that differ between two builds of the
same source. Every list in the document is sorted, so leaving both off makes a build reproducible
byte for byte.

## Reference

| Export    | Signature                                                       | What it returns                                       |
| --------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| `sbom`    | `(stated?: Described) => Plugin`                                | A plugin that emits the document alongside the bundle |
| `written` | `(stated: Described, bundling: Bundling, at: string) => string` | The serialised document for one build                 |

The bundler registers the plugin as `stealth:sbom` and calls it at `generateBundle`, after the
module graph is complete and before the output is written. `written` does the same work without a
bundler around it, taking the build context that hook receives as `bundling` and the directory of
the package being described as `at`. `Described` and `Supplier` are exported as types, and the
preceding tables list their fields.

## The document

- **Components.** Each installed package the build imported from appears once, typed as a library.
  The edges between them are drawn from the module graph the components themselves came from.
- **Metadata.** The subject is built from the described package's manifest, under the `build`
  lifecycle phase. The tool list records the vite and rolldown versions read at run time, together
  with every `devDependency` of the described package that resolves.
- **Licence evidence.** A licence or copying file in a package's top directory is attached to its
  component as base64 text, beside the expression its manifest declares. An expression SPDX does not
  define is recorded as a name instead.
- **Integrity and origin.** A digest the lockfile pinned becomes the component's hash, and a source
  other than the default registry becomes a `vcs_url` or `repository_url` qualifier on the package
  URL. Each installed package is matched to the lockfile by its name and the version its own
  manifest states, so two installed versions of one name each carry their own digest and source. A
  source written as a URL is written without the credential in front of its host and without its
  query, and with the fragment that names a commit. The search reads `bun.lock` first and
  `pnpm-lock.yaml` second, from the nearest directory above the package that has either one.

A missing manifest, an unreadable lockfile and a digest nothing can parse each cost the document
detail rather than failing the build.

## Licence

MIT. See [LICENSE](LICENSE).
