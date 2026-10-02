/**
 * Types the `sticky` prop of a band and converts it to the attribute the recipe reads.
 */

/**
 * Describes the prop of a band that can stick to the top of the page.
 */
export interface StickyProps {
  /**
   * Whether the band remains at the top while the page scrolls under it.
   */
  readonly sticky?: boolean | undefined;
}

/**
 * Converts the `sticky` prop to the `data-sticky` attribute the recipe reads.
 *
 * @param sticky - Whether the band sticks.
 * @returns An empty string when the band sticks, and `undefined` otherwise.
 */
export function stuck(sticky?: boolean): "" | undefined {
  return sticky === true ? "" : undefined;
}
