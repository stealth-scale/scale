/**
 * Re-exports the index's types and the audit engine's, so no module of the catalogue imports the
 * plugin or the engine at run time.
 *
 * @remarks
 *   An inline `import { type Indexed } from "…"` is not erased under `verbatimModuleSyntax`. It
 *   emits a side-effect import, which puts the build plugin, its Node built-ins and TypeScript
 *   itself into the browser's module graph, and puts the whole audit engine into the chunk every
 *   reader loads first. A top-level `export type` is erased, so this file compiles to nothing.
 */

export type { Anatomy, Dropped, Indexed, Member, Prop } from "@stealthscale/vite-plugin-specimen";
export type { AxeResults, ImpactValue, Result, RunOptions } from "axe-core";
