/**
 * Draws how far a thing casts: six heights of shadow, an inner shadow and an inset line, tinted in
 * the theme's hue and darker after dark.
 */

import { type SemanticTokens } from "#pandacss.ts";

/**
 * Describes the shadows a theme states.
 */
type Shadows = NonNullable<SemanticTokens["shadows"]>;

/**
 * Describes what a theme states about its depth.
 */
export interface Depth {
  /**
   * A multiplier on every shadow's ink, for a theme that casts harder or softer. One unless
   * stated.
   */
  depth?: number | undefined;

  /**
   * The hue every shadow is tinted with. The foundation's blue unless stated.
   */
  hue?: number | undefined;
}

/**
 * Describes the depth as drawn: the one category a theme spreads into its semantic tokens.
 */
export interface Drawn {
  /**
   * The six heights, the inner shadow and the inset line.
   */
  shadows: Shadows;
}

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
 * Fixes the rim a height casts after dark: a one-pixel line of white inside its edge.
 *
 * @remarks
 *   A shadow is darker than the page it falls on, and a dark page leaves it nowhere to fall, so
 *   a raised panel after dark reads as flat and its edge is lost against a page a few points
 *   darker. The rim lights the edge from inside instead, at an alpha that reads as an edge and
 *   not as a border. By day it is transparent, so a height casts a shadow alone.
 */
const RIM = "inset 0 0 0 1px light-dark(transparent, oklch(100% 0 0 / 0.12))";

/**
 * Fixes the hue and the depth the foundation casts at.
 */
const DEFAULTS = { depth: 1, hue: 262 };

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
 *   under, the same way every color is. Each height carries the rim after dark, so a raised panel
 *   keeps an edge on a page its shadow cannot fall on. The inner shadow and the inset line are
 *   not heights and carry none.
 * @param hue - The hue the shadow is tinted with.
 * @param weight - A multiplier on every alpha, for a theme that casts harder or softer.
 */
export function shadows(hue = DEFAULTS.hue, weight = DEFAULTS.depth): Shadows {
  /**
   * Writes one shadow from its geometry and its alpha, the ink of each mode inside it.
   */
  const cast = (geometry: string, alpha: number): string =>
    `${geometry} light-dark(${ink(hue, LIGHT_INK, alpha * weight)}, ${ink(hue, 0, alpha * DARK_WEIGHT * weight)})`;

  return {
    ...Object.fromEntries(
      HEIGHTS.map(([name, offset, blur, alpha]) => [
        name,
        { value: `${cast(`0 ${String(offset)}px ${String(blur)}px`, alpha)}, ${RIM}` },
      ]),
    ),
    inner: { value: cast("inset 0 2px 4px 0", 0.05) },
    inset: { value: cast("inset 0 0 0 1px", 0.1) },
  };
}

/**
 * Draws the depth a theme states.
 *
 * @param stated - The hue and the multiplier, each the foundation's unless stated.
 */
export function depth(stated: Depth = {}): Drawn {
  return { shadows: shadows(stated.hue ?? DEFAULTS.hue, stated.depth ?? DEFAULTS.depth) };
}
