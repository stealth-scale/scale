/**
 * Parses CSS lengths and measures the gap between two laid-out elements.
 *
 * @remarks
 *   Jsdom does no layout and reports every rectangle as zero, so a specification running under
 *   jsdom has to measure a stub rather than the element it rendered. Real numbers need a browser.
 */

/**
 * The horizontal edges of a rectangle, in CSS pixels.
 *
 * @remarks
 *   A `DOMRect` structurally satisfies this, so it passes with no cast. There are no vertical
 *   edges here because nothing in this file reads them.
 */
export interface Box {
  /**
   * The left edge, measured from the left of the viewport.
   */
  left: number;

  /**
   * The right edge, measured from the left of the viewport.
   */
  right: number;
}

/**
 * An element, or a stand-in for one, that can report its own rectangle.
 *
 * @remarks
 *   Structural on purpose: a real DOM element satisfies it without a cast, and so does a literal
 *   with two fixed numbers, which is how a jsdom specification gets a rectangle worth asserting on.
 */
export interface Measured {
  /**
   * Returns the rectangle the element occupies as of this call.
   */
  getBoundingClientRect: () => Box;
}

/**
 * Strips the unit off a CSS length and returns the number, or 0 if it does not start with one.
 *
 * @remarks
 *   `Number.parseFloat` stops at the first character that cannot continue a number, so `16px`
 *   gives 16 and `auto` gives 0. Callers cannot tell a real zero from a length that failed to
 *   parse, which is fine for assertions and wrong for anything that has to branch on it.
 */
export function pixels(length: string): number {
  // eslint-disable-next-line unicorn/prefer-number-coercion -- `Number('16px')` is NaN
  const value = Number.parseFloat(length);
  return Number.isNaN(value) ? 0 : value;
}

/**
 * Measures the gap between the first element's right edge and the second element's left edge.
 *
 * @remarks
 *   The result is unsigned. An 8-pixel overlap and an 8-pixel gap both measure 8, so a caller that
 *   needs to tell them apart has to compare the edges itself.
 * @returns The distance in CSS pixels, 0 when the two elements share an edge.
 */
export function seamBetween(first: Measured, second: Measured): number {
  return Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().right);
}
