/**
 * Declares what a page of a catalogue is, and draws a component once per value of an axis.
 *
 * @remarks
 *   A specimen file's default export is `specimen()`, which the index plugin parses out of the
 *   source without evaluating the module. Every part a matrix draws is a component of the library,
 *   so the package states no recipe and a theme that moves the library moves the catalogue with it.
 *   The catalogue draws what the plugin indexed. An application hands `Catalogue` the pages out of
 *   `virtual:specimen-index` and supplies the providers, so this package needs no build of its own
 *   to render and a specification renders it without one.
 * @packageDocumentation
 */

export * from "#catalogue/index.ts";
export * from "#matrix/index.ts";
export { scene, type Scene, specimen, type Specimen } from "#page.ts";
export * from "#room/index.ts";
export * from "#tile/index.ts";
export { NAMESPACE, type Namespace, type Prefix, useWords } from "#words.ts";
