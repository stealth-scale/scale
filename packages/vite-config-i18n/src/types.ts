/**
 * Re-exports the plugin's types through a module that loads nothing at run time.
 *
 * @remarks
 *   Under `verbatimModuleSyntax`, TypeScript keeps an inline `import { type Options }` as a runtime
 *   import, which loads the plugin whenever the configuration is read, including when the task
 *   runner reads it for its metadata alone. A top-level `export type` is erased entirely, so this
 *   module compiles to nothing and a layer gets the plugin's types without loading it.
 */

export type { Options } from "@stealthscale/vite-plugin-i18n";
