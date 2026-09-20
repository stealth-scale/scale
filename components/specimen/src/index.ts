/**
 * Declares what a page of a catalogue is, and draws a component once per value of an axis or once
 * per cell a specimen lays out itself.
 *
 * @remarks
 *   A specimen file's default export is `specimen()`, which the index plugin parses out of the
 *   source without evaluating the module. A drawing of a component is a `Sample`: a caption, the
 *   component, and a box the specimen chooses the look of. A `Matrix` draws one sample per value of
 *   an axis, and a `Board` draws the samples a specimen writes and arranges on the library's grid.
 *   Both state the look of their samples once, so the two read alike on one page. A scene states
 *   how it meets the card it is drawn on through its `frame`.
 *   The catalogue draws what the plugin indexed. An application hands `Catalogue` the pages out of
 *   `virtual:specimen-index` and supplies the providers, so this package needs no build of its own
 *   to render and a specification renders it without one.
 * @packageDocumentation
 */

export * from "#board/index.ts";
export * from "#catalogue/index.ts";
export * from "#device/index.ts";
export * from "#framed/index.ts";
export * from "#matrix/index.ts";
export { type Frame, FRAMES, scene, type Scene, specimen, type Specimen } from "#page.ts";
export * from "#room/index.ts";
export * from "#sample/index.ts";
export * from "#tile/index.ts";
export { NAMESPACE, type Namespace, type Prefix, useWords } from "#words.ts";
