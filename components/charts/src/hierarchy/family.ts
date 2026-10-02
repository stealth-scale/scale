/**
 * Resolves the colors of a hierarchy's families: each top-level node paints its parts in its own
 * color, mixed over the panel by each part's size among its siblings.
 *
 * @remarks
 *   A family shares a hue, and its largest part is its strongest: the largest sibling takes the
 *   whole color and the smallest 45% of it over the panel. The mix is a `color-mix` over
 *   `bg.panel` rather than an opacity, so a mark is opaque and a swatch repeats its color.
 */

/**
 * Share of the family's color, in percent, the smallest sibling takes over the panel.
 */
const LIGHTEST = 45;

/**
 * Describes how a family of marks is painted: its color and its opacity.
 */
export interface Family {
  /**
   * CSS value of the family's color.
   */
  readonly color: string;

  /**
   * CSS value of the family's opacity, which the legend fades.
   */
  readonly opacity: string;
}

/**
 * Returns the share of a family's color, in percent, a part takes by its place among its siblings:
 * 100 for the largest down to 45 for the smallest.
 *
 * @param at - The part's place among its siblings, largest first.
 * @param count - The number of siblings.
 */
export function shareOf(at: number, count: number): number {
  return count < 2 ? 100 : LIGHTEST + ((100 - LIGHTEST) * (count - 1 - at)) / (count - 1);
}

/**
 * Returns the CSS value of a color mixed over the panel at a share, in whole percents.
 *
 * @param color - The CSS value of the color.
 * @param share - The share of the color, in percent.
 */
export function mixOf(color: string, share: number): string {
  return `color-mix(in oklab, ${color} ${String(Math.round(share))}%, var(--colors-bg-panel))`;
}
