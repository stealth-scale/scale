/**
 * Resolves the color of a series: the theme's series color at its position, the `chart` role of
 * the palette it states, or the series color it names.
 */

import { type Hue, type Palette, type SERIES } from "@stealthscale/theme/authoring";

/**
 * Describes one of the theme's series colors by name, from `series.1` to `series.8`.
 */
export type SeriesColor = `series.${(typeof SERIES)[number]}`;

/**
 * Describes the color a series takes: a hue, a semantic palette or one of the series colors.
 *
 * @remarks
 *   A series with a meaning of its own takes a semantic palette, such as `error` for a threshold.
 *   A series that names a series color keeps it at any position, such as the same series in two
 *   charts.
 */
export type ChartColor = Hue | Palette | SeriesColor;

/**
 * Fixes the number of colors in the theme's series family, `series.1` to `series.8`.
 *
 * @remarks
 *   Written as a number, so the chart kit does not load the theme's authoring module at run time.
 *   A spec checks it against the theme's list.
 */
export const SERIES_COLORS = 8;

/**
 * Returns the CSS value of a palette's `chart` role, or of the series color a name states, which a
 * mark or a recharts child such as a `ReferenceLine` takes as its `stroke` or `fill`.
 *
 * @remarks
 *   The theme sets the `chart` role to the lightest color of the palette's hue that keeps 3:1 or
 *   more against the page and the panel, and each theme's contrast check requires that ratio. On
 *   the foundation's light page the hues' chart colors are at 63 to 66% lightness, and their solids
 *   at 47 to 58%. The contrast check measures every series color at the same ratio.
 * @param color - The hue, the palette or the series color.
 */
export function colorOf(color: ChartColor): string {
  return color.startsWith("series.")
    ? `var(--colors-${color.replace(".", "-")})`
    : `var(--colors-${color}-chart)`;
}

/**
 * Returns the CSS value of the color of the series at a position: its palette's `chart` role where
 * it states one, else the theme's series color at that position.
 *
 * @remarks
 *   Each theme takes its series colors from its own colors first, so a chart of three series wears
 *   the brand. The ninth series takes the first color again.
 * @param color - The palette the series states, if any.
 * @param index - The series' position in the chart.
 */
export function colorAt(color: ChartColor | undefined, index: number): string {
  return color === undefined
    ? `var(--colors-series-${String((index % SERIES_COLORS) + 1)})`
    : colorOf(color);
}

/**
 * Returns the CSS value of a color mixed towards the ink, `fg`, by a share in percent, or the color
 * itself without a share.
 *
 * @remarks
 *   A chart color mixed towards the ink measured 3:1 or more against the page and the panel at
 *   every share, on the 27 chart colors of the ten themes in both modes and both engines.
 * @param color - The CSS value of the color.
 * @param share - The share of the ink, from 0 to 100.
 */
export function inkedOf(color: string, share: number | undefined): string {
  return share === undefined || share <= 0
    ? color
    : `color-mix(in oklab, var(--colors-fg) ${String(Math.min(share, 100))}%, ${color})`;
}
