/**
 * Configures the three kinds of package a specimen catalogue is built from: the specimens, the
 * application that displays them, and the workspace root they sit under.
 *
 * @remarks
 *   Three entry points, because the three read different things. A specimen package takes
 *   `layers()`, which keeps its specimens out of its own coverage. The application takes
 *   `catalogue()`, which adds the index plugin and the scan entries. The root takes `workspace()`,
 *   because the linter reads the root configuration and nothing else.
 * @packageDocumentation
 */

export { catalogue } from "#catalogue.ts";
export { crawled } from "#crawled.ts";
export { indexed } from "#indexed.ts";
export { layers } from "#layers.ts";
export type { Options } from "#types.ts";
export { workspace } from "#workspace.ts";
