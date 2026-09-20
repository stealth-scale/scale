/**
 * Re-exports the index's types, so no module of the catalogue imports the plugin at run time.
 *
 * @remarks
 *   An inline `import { type Indexed } from "…"` is not erased under `verbatimModuleSyntax`. It
 *   emits a side-effect import, which puts the build plugin, its Node built-ins and TypeScript
 *   itself into the browser's module graph. A top-level `export type` is erased, so this file
 *   compiles to nothing.
 */

export type {
  Anatomy,
  Dropped,
  Fragments,
  Indexed,
  Member,
  Prop,
} from "@stealthscale/vite-plugin-specimen";
