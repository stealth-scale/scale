/**
 * Resolves a gauge's zones into bands: each zone's span of the range, sorted and clamped, and the
 * part of the range no zone covers. The gauge and the bar charts' bullet share the bands, their
 * tint and their words.
 */

import { type ReactNode } from "react";

import { type ChartColor, colorOf } from "#chart/colors.ts";

/**
 * Share of a zone's color in its tint, in percent, the rest the panel's, so a zone is paler than a
 * mark in its color.
 */
const TINT = 40;

/**
 * Describes one zone of a gauge's range: where it ends, its name and its palette.
 */
export interface GaugeZone {
  /**
   * Palette the zone and a reading inside it take, such as `success`, `warning` or `error`. The
   * neutral palette unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Name of the zone, written under the reading while the reading is inside it.
   */
  readonly label?: ReactNode;

  /**
   * Value the zone ends at. It starts where the zone before it ends, or at the range's minimum. A
   * zone that ends past the maximum, `Infinity` included, ends at the maximum.
   */
  readonly upTo: number;
}

/**
 * Describes one band of the dial: the span of a zone, or the part of the range no zone covers.
 */
export interface GaugeBand {
  /**
   * Palette of the zone, or none for a zone without one and for the part no zone covers.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Value the band starts at.
   */
  readonly from: number;

  /**
   * Name of the zone, or none for the part no zone covers.
   */
  readonly label?: ReactNode;

  /**
   * Value the band ends at.
   */
  readonly to: number;

  /**
   * Whether the band is the part of the range no zone covers.
   */
  readonly uncovered: boolean;
}

/**
 * Returns the zones as bands of the range from `min` to `max`: sorted by where they end, each
 * starting where the one before it ends, clamped to the range, and the part past the last zone as
 * an uncovered band.
 *
 * @remarks
 *   A zone whose end is `NaN` is left out, and so is a zone that ends at or before the zone before
 *   it. The part of the range no zone covers renders as the dial's track rather than as the last
 *   zone, so a gauge that classifies part of its range shows which part.
 * @param zones - The zones in any order.
 * @param min - The value the range starts at.
 * @param max - The value the range ends at.
 */
export function gaugeBands(zones: readonly GaugeZone[], min: number, max: number): GaugeBand[] {
  const sorted = zones
    .filter((zone) => !Number.isNaN(zone.upTo))
    .toSorted((first, second) => first.upTo - second.upTo);
  const bands: GaugeBand[] = [];
  let from = min;

  for (const zone of sorted) {
    const to = Math.min(max, zone.upTo);

    if (to > from) {
      bands.push({ color: zone.color, from, label: zone.label, to, uncovered: false });
      from = to;
    }
  }

  return from < max ? [...bands, { from, to: max, uncovered: true }] : bands;
}

/**
 * Returns the band a value is in: the first whose end the value has not passed, else the last.
 *
 * @param bands - The bands `gaugeBands` returns.
 * @param value - The value within the range.
 */
export function gaugeBandAt(bands: readonly GaugeBand[], value: number): GaugeBand | undefined {
  return bands.find((band) => value <= band.to) ?? bands.at(-1);
}

/**
 * Returns the CSS color of a zone's tint: its palette, the neutral palette's unless it states one,
 * mixed with the panel.
 *
 * @param zone - The zone, or the band it resolved into.
 */
export function tintOf(zone: Pick<GaugeZone, "color">): string {
  return `color-mix(in oklab, ${colorOf(zone.color ?? "neutral")} ${String(TINT)}%, var(--colors-bg-panel))`;
}

/**
 * Returns a value's words with the name of the band it is in, where that name is text.
 *
 * @param words - The value, written out.
 * @param band - The band the value is in, if any.
 */
export function zonedText(words: string, band?: GaugeBand): string {
  return typeof band?.label === "string" ? `${words}, ${band.label}` : words;
}
