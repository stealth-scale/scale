/**
 * Reads a rendered React component through the markings its anatomy carries.
 *
 * @remarks
 *   A specification reaches a piece of a component by the part name it is marked with, and its
 *   state by the data attributes beside it. A class name, the text and the shape of the tree all
 *   move under a restyling, so a specification reaching through any of those three fails on a
 *   change that broke nothing.
 * @packageDocumentation
 */

export { accessibilityViolations } from "#accessibility.ts";
export { type ConformanceOptions, violations } from "#conformance.ts";
export { aria, attr, holds, renderedAs } from "#dom.ts";
export { drawn, hovered, pressed, rootedViolations, settled, unhovered } from "#machine.ts";
export { only, part, parts, type Rendered } from "#part.ts";
