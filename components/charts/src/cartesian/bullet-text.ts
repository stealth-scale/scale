/**
 * Writes a bar's value in a bullet graph's tooltip: the value, its target, and the zone the value
 * is in.
 */

import { type CoreSeries } from "#cartesian/types.ts";
import { type TooltipEntry } from "#chart/tooltip.tsx";
import { gaugeBandAt, gaugeBands, type GaugeZone, zonedText } from "#gauge-chart/bands.ts";

/**
 * Word a target is named by unless a chart states one.
 */
export const TARGET_LABEL = "Target";

/**
 * Describes what a bullet graph's tooltip words are built from.
 */
export interface BulletWords {
  /**
   * Series the chart plots, which state the fields their targets read.
   */
  readonly series: readonly CoreSeries[];

  /**
   * Word the target is named by. "Target" unless stated.
   */
  readonly targetLabel?: string | undefined;

  /**
   * Writes a value in the format of the axis its series reads.
   */
  readonly write: (value: unknown, entry?: TooltipEntry) => string;

  /**
   * Zones of the value axis.
   */
  readonly zones: readonly GaugeZone[];
}

/**
 * Returns the target a row states in a field, or none where the field is not a finite number.
 *
 * @param row - The row a bar reads.
 * @param field - The field the bar's series reads its target from, if any.
 */
export function targetOf(row: unknown, field: string | undefined): number | undefined {
  if (field === undefined || typeof row !== "object" || row === null) return undefined;

  const value: unknown = Reflect.get(row, field);

  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * Returns the writer of a bar's value: the value, then the target after its name where the bar's
 * series reads one, then the name of the zone the value is in where the name is text.
 *
 * @remarks
 *   The zones resolve against every value, so a value past the last zone is in none.
 * @param words - The series, the target's name, the writer and the zones.
 */
export function bulletWordsOf({
  series,
  targetLabel = TARGET_LABEL,
  write,
  zones,
}: BulletWords): (value: unknown, entry?: TooltipEntry) => string {
  const bands = gaugeBands(zones, -Infinity, Infinity);

  return (value, entry) => {
    const declared = series.find((each) => each.key === entry?.dataKey);
    const target = targetOf(entry?.payload, declared?.target);
    const written = write(value, entry);
    const words =
      target === undefined ? written : `${written}, ${targetLabel} ${write(target, entry)}`;

    return typeof value === "number" ? zonedText(words, gaugeBandAt(bands, value)) : words;
  };
}
