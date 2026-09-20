/**
 * Applies the run-time density to a length a recipe reads from a scaled token.
 *
 * @remarks
 *   The density is a multiplier a page sets with the `data-density` attribute, on the document or
 *   on any element for a subtree. It is applied here rather than in the token because a custom
 *   property inherits the value it computed where it was declared, with every `var()` in it
 *   already substituted: a token carrying the multiplier is fixed at the density of the element
 *   that declared it, and a subtree that sets another density inherits the same length. A normal
 *   property resolves its `var()` on the element it is applied to, so a control inside a compact
 *   subtree is drawn at the compact density and one outside it is not.
 */

import { DENSITY } from "#draw/metrics.ts";

/**
 * Multiplies a length by the density in force where it is drawn.
 *
 * @param length - The length, as a token reference or as CSS writes it.
 */
export function dense(length: string): string {
  return `calc(${length} * var(${DENSITY}, 1))`;
}
