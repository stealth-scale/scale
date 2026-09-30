/**
 * Places the values of a heat grid on its color scale: the domain the values span, where a value
 * falls in it, the color a cell fills with, and the colors and values of the grid's key.
 *
 * @remarks
 *   A sequential scale mixes one color over the panel from 12% at the domain's minimum to the whole
 *   color at its maximum, so the lowest value keeps a tint and reads apart from a cell without a
 *   value. A diverging scale mixes one of two colors from the panel at the midpoint to the whole
 *   color at the further end of the domain, with one reach on both sides, so a small deviation
 *   never reads as large as the largest one. A value past the domain takes the color of its end.
 *   Every mix is a `color-mix` over `bg.panel`, so a cell is opaque and the key repeats its
 *   colors.
 */

import { type ChartColor, colorOf } from "#chart/colors.ts";
import { mixOf } from "#hierarchy/family.ts";

/**
 * Describes the values a heat grid's scale spans.
 */
export interface HeatmapDomain {
  /**
   * Value a cell takes the scale's strongest color at.
   */
  readonly max: number;

  /**
   * Value a cell takes the scale's faintest color at.
   */
  readonly min: number;
}

/**
 * Describes how a scale reads a value: `sequential` as an amount from least to most, `diverging` as
 * a deviation either side of a midpoint.
 */
export type HeatmapScale = "diverging" | "sequential";

/**
 * Describes the two colors of a diverging scale.
 */
export interface HeatmapColors {
  /**
   * Color of a value under the midpoint.
   */
  readonly negative: ChartColor;

  /**
   * Color of a value over the midpoint.
   */
  readonly positive: ChartColor;
}

/**
 * Describes what a heat grid's cells take their colors from.
 */
export interface Paint {
  /**
   * Color of a sequential scale.
   */
  readonly color: ChartColor;

  /**
   * Colors of a diverging scale.
   */
  readonly colors: HeatmapColors;

  /**
   * Values the scale spans.
   */
  readonly domain: HeatmapDomain;

  /**
   * Value a diverging scale takes the panel at.
   */
  readonly midpoint: number;

  /**
   * How the scale reads a value.
   */
  readonly scale: HeatmapScale;
}

/**
 * Share of the color, in percent, a sequential scale takes at the domain's minimum.
 */
const FLOOR = 12;

/**
 * CSS value of the panel, where a diverging scale's midpoint is.
 */
const PANEL = "var(--colors-bg-panel)";

/**
 * Returns a number clamped between two bounds.
 */
function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

/**
 * Returns how far a diverging scale spans on each side of its midpoint: the distance from the
 * midpoint to the further end of the domain.
 */
function reachOf({ domain, midpoint }: Pick<Paint, "domain" | "midpoint">): number {
  return Math.max(Math.abs(domain.max - midpoint), Math.abs(domain.min - midpoint));
}

/**
 * Describes a reading with a value, such as a heatmap's cell or a calendar's day.
 */
export interface Valued {
  /**
   * Value, or `null` for a reading that is missing.
   */
  readonly value: null | number;
}

/**
 * Returns the span of the values that are finite numbers, which is a heat grid's domain unless the
 * caller pins one.
 *
 * @remarks
 *   A value that is `null` or not finite is missing and does not stretch the domain. Two grids read
 *   against each other take one domain, the span of both grids' values together.
 * @param cells - The readings, such as a heatmap's cells or a calendar's days.
 * @returns The least and the greatest value, or 0 and 0 without a value.
 */
export function heatmapDomain(cells: readonly Valued[]): HeatmapDomain {
  const values = cells.flatMap(({ value }) =>
    value !== null && Number.isFinite(value) ? [value] : [],
  );

  return values.length === 0
    ? { max: 0, min: 0 }
    : { max: Math.max(...values), min: Math.min(...values) };
}

/**
 * Returns where a value falls on the scale: from 0 at the domain's minimum to 1 at its maximum on a
 * sequential scale, and from -1 to 1 about the midpoint on a diverging one.
 *
 * @remarks
 *   A domain of one value places every value at 1, so a grid of equal values renders at full
 *   strength. A diverging scale spans the distance from the midpoint to the further end of the
 *   domain on both sides, and a domain that is all midpoint places every value at 0.
 * @param value - A finite value.
 * @param paint - The scale.
 */
export function intensityOf(
  value: number,
  { domain, midpoint, scale }: Pick<Paint, "domain" | "midpoint" | "scale">,
): number {
  if (scale === "diverging") {
    const reach = reachOf({ domain, midpoint });

    return reach === 0 ? 0 : clamp((value - midpoint) / reach, -1, 1);
  }

  const span = domain.max - domain.min;

  return span === 0 ? 1 : clamp((value - domain.min) / span, 0, 1);
}

/**
 * Returns the CSS value of the color a cell with a value fills with.
 *
 * @param value - A finite value.
 * @param paint - The scale and its colors.
 */
export function fillOf(value: number, paint: Paint): string {
  const at = intensityOf(value, paint);

  if (paint.scale === "diverging") {
    return mixOf(
      colorOf(at < 0 ? paint.colors.negative : paint.colors.positive),
      Math.abs(at) * 100,
    );
  }

  return mixOf(colorOf(paint.color), FLOOR + at * (100 - FLOOR));
}

/**
 * Returns the colors of the key's bar, from its start to its end: the faintest and the strongest
 * color of a sequential scale, or the negative end, the panel and the positive end of a diverging
 * one.
 *
 * @param paint - The scale and its colors.
 */
export function rampOf(paint: Paint): readonly string[] {
  if (paint.scale === "diverging") {
    return [
      mixOf(colorOf(paint.colors.negative), 100),
      PANEL,
      mixOf(colorOf(paint.colors.positive), 100),
    ];
  }

  return [mixOf(colorOf(paint.color), FLOOR), mixOf(colorOf(paint.color), 100)];
}

/**
 * Describes the values the key writes: at the start and the end of its bar, and a diverging scale's
 * midpoint under the bar's middle.
 */
export interface Ticks {
  /**
   * Value at the bar's end.
   */
  readonly high: number;

  /**
   * Value at the bar's start.
   */
  readonly low: number;

  /**
   * Value under the bar's middle, on a diverging scale.
   */
  readonly midpoint?: number | undefined;
}

/**
 * Returns the values the key writes: the domain's two ends on a sequential scale, and the midpoint
 * with the scale's reach on either side of it on a diverging one.
 *
 * @param paint - The scale.
 */
export function ticksOf({
  domain,
  midpoint,
  scale,
}: Pick<Paint, "domain" | "midpoint" | "scale">): Ticks {
  if (scale === "sequential") return { high: domain.max, low: domain.min };

  const reach = reachOf({ domain, midpoint });

  return { high: midpoint + reach, low: midpoint - reach, midpoint };
}
