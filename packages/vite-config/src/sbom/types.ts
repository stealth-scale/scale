/**
 * Re-exports the inventory plugin's types through a module that loads nothing.
 *
 * @remarks
 *   An inline `import { type Supplier } from "…"` keeps an import of the module under
 *   `verbatimModuleSyntax`, which loads the plugin whenever the configuration is read, including
 *   when the task runner reads it for its metadata alone. A top-level `export type` is erased in
 *   full, so this module compiles to nothing and a layer reads the plugin's types without loading
 *   it.
 */

export type { Supplier } from "@stealthscale/vite-plugin-sbom";
