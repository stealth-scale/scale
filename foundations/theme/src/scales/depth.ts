/**
 * Draws the two scales that say how far a thing is from the page: how round its corners are, and
 * how far it casts.
 */

import { type SemanticTokens } from "#pandacss.ts";

/**
 * Describes the radii a theme states.
 */
type SemanticRadii = NonNullable<SemanticTokens["radii"]>;

/**
 * Describes the shadows a theme states.
 */
type SemanticShadows = NonNullable<SemanticTokens["shadows"]>;

/**
 * Places each corner as a share of the largest, so a nested corner stays concentric with the one
 * around it however round the theme is.
 */
const CORNERS: ReadonlyArray<readonly [name: string, share: number]> = [
  ["l1", 0.5],
  ["l2", 0.75],
  ["l3", 1],
];

/**
 * Places each height: how far the shadow falls, how far it spreads, and how dark it is.
 */
const HEIGHTS: ReadonlyArray<readonly [name: string, offset: number, blur: number, alpha: number]> =
  [
    ["xs", 1, 2, 0.05],
    ["sm", 2, 4, 0.06],
    ["md", 4, 8, 0.08],
    ["lg", 8, 16, 0.1],
    ["xl", 16, 28, 0.12],
    ["2xl", 24, 48, 0.16],
  ];

/**
 * Fixes how much darker a shadow is drawn on a dark page, where the same alpha would disappear.
 */
const DARK_WEIGHT = 3;

/**
 * Fixes the lightness of the ink a shadow is cast in on a light page.
 */
const LIGHT_INK = 20;

/**
 * Draws three corners from the roundest one, keyed `l1` to `l3`.
 *
 * @param largest - The radius of the outermost corner, as CSS writes it.
 */
export function radii(largest: string): SemanticRadii {
  return Object.fromEntries(
    CORNERS.map(([name, share]) => [
      name,
      { value: share === 1 ? largest : `calc(${largest} * ${String(share)})` },
    ]),
  );
}

/**
 * Writes the ink one shadow is cast in.
 *
 * @param hue - The hue the ink is tinted with.
 * @param lightness - How light the ink is, which is black on a dark page.
 * @param alpha - How opaque it is.
 */
function ink(hue: number, lightness: number, alpha: number): string {
  return `oklch(${String(lightness)}% 0.02 ${String(hue)} / ${alpha.toFixed(3)})`;
}

/**
 * Draws six heights, an inner shadow and an inset line, tinted by the theme's hue and darker in
 * dark mode.
 *
 * @remarks
 *   A shadow on a dark page has to be darker than the page to be seen at all, which is why the
 *   weight differs by mode and not the alpha alone. The mode is stated in the ink alone, as
 *   `light-dark()`, so a shadow is declared once and cast in the mode of the element it falls
 *   under, the same way every color is.
 * @param hue - The hue the shadow is tinted with.
 * @param depth - A multiplier on every alpha, for a theme that casts harder or softer.
 */
export function shadows(hue: number, depth = 1): SemanticShadows {
  /**
   * Writes one shadow from its geometry and its alpha, the ink of each mode inside it.
   */
  const cast = (geometry: string, alpha: number): SemanticShadows[string] => ({
    value: `${geometry} light-dark(${ink(hue, LIGHT_INK, alpha * depth)}, ${ink(hue, 0, alpha * DARK_WEIGHT * depth)})`,
  });

  return {
    ...Object.fromEntries(
      HEIGHTS.map(([name, offset, blur, alpha]) => [
        name,
        cast(`0 ${String(offset)}px ${String(blur)}px`, alpha),
      ]),
    ),
    inner: cast("inset 0 2px 4px 0", 0.05),
    inset: cast("inset 0 0 0 1px", 0.1),
  };
}
