/**
 * Re-exports the plugin's types and Vite's through a module that loads nothing at run time.
 *
 * @remarks
 *   Under `verbatimModuleSyntax`, TypeScript keeps an inline `import { type ProductOptions }` as a
 *   runtime import, which loads the plugin whenever the configuration is read. A top-level
 *   `export type` is erased entirely, so this module compiles to nothing.
 */

export type { ProductOptions, StandalonePage } from "@stealthscale/vite-plugin-product";
export type { ConfigEnv } from "vite";
