/**
 * Configures a package that holds specimens, an application that shows a catalogue of them, and
 * the workspace root they sit under.
 *
 * @remarks
 *   Three entry points, because three configurations read different things. A package holding
 *   specimens takes `layers()`, which stops counting them towards its coverage. The application
 *   takes `catalogue()`, which adds the index plugin and the scan entries. The root takes
 *   `workspace()`, because the linter reads the root's configuration and no other.
 * @packageDocumentation
 */

export { type Options } from "@stealthscale/vite-plugin-specimen";

export { catalogue } from "#catalogue.ts";
export { crawled } from "#crawled.ts";
export { indexed } from "#indexed.ts";
export { layers } from "#layers.ts";
export { workspace } from "#workspace.ts";
