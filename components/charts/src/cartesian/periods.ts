/**
 * Lines up two periods of rows and writes the change from the earlier period in the tooltip.
 *
 * @remarks
 *   The periods match by position, not by date. The first day of one period lines up with the
 *   first day of the other, so a month of 30 days lines up with one of 31. A previous period that
 *   is shorter leaves the last rows without its values, because a zero would state that nothing
 *   happened. The change is the current value's share above or below the earlier one, written
 *   after the value with the locale's list separator.
 */

import { finiteAt, finiteOf } from "#cartesian/finite.ts";
import { keyOf } from "#cartesian/formats.ts";
import { type CartesianSeries } from "#cartesian/types.ts";
import { separatorOf } from "#chart/separator.ts";
import { type TooltipEntry } from "#chart/tooltip.tsx";
import { type SeriesOptions } from "#chart/use-chart.ts";

/**
 * Suffix of each field copied from the previous period, unless stated.
 */
const SUFFIX = "Previous";

/**
 * Options of the change from the earlier period: a signed percentage to one decimal.
 */
const CHANGE: Intl.NumberFormatOptions = {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
  style: "percent",
};

/**
 * Describes how `alignPeriods` merges two periods.
 *
 * @typeParam Row - One row of either period.
 */
export interface AlignOptions<Row> {
  /**
   * Field of each row the category axis reads. The merged row keeps the previous period's own
   * category under the field's name and the suffix.
   */
  readonly categoryKey: Extract<keyof Row, string>;

  /**
   * Fields copied from the previous period into each merged row.
   */
  readonly keys: ReadonlyArray<Extract<keyof Row, string>>;

  /**
   * Suffix of each copied field's name. "Previous" unless stated, so `revenue` becomes
   * `revenuePrevious`.
   */
  readonly suffix?: string | undefined;
}

/**
 * Returns a row per row of the current period, with the fields of the previous period's row at the
 * same position.
 *
 * @typeParam Row - One row of either period.
 * @param current - The current period's rows, in order.
 * @param previous - The previous period's rows, in order.
 * @param options - The category field, the copied fields and their suffix.
 */
export function alignPeriods<Row extends Record<string, unknown>>(
  current: readonly Row[],
  previous: readonly Row[],
  options: AlignOptions<Row>,
): Array<Record<string, unknown>> {
  const suffix = options.suffix ?? SUFFIX;
  const merged: Array<Record<string, unknown>> = [];

  for (const [index, row] of current.entries()) {
    const before = previous[index];
    const entry: Record<string, unknown> = { ...row };

    if (before !== undefined) {
      for (const key of [options.categoryKey, ...options.keys]) {
        entry[`${key}${suffix}`] = before[key];
      }
    }

    merged.push(entry);
  }

  return merged;
}

/**
 * Returns the kit's series of a preset's series, with the neutral palette for an earlier period
 * that states no color.
 *
 * @param series - The preset's series, in order.
 */
export function seriesOptionsOf(series: readonly CartesianSeries[]): SeriesOptions[] {
  return series.map((each) => ({
    color: each.color ?? (each.previousOf === undefined ? undefined : "neutral"),
    ink: each.ink,
    key: each.key,
    label: each.label,
  }));
}

/**
 * Describes what the tooltip's words of a compared series are built from.
 */
export interface ChangeOptions {
  /**
   * Locale the change is written in.
   */
  readonly locale: string;

  /**
   * Series the chart plots, of which a series with `previousOf` is the earlier period of another.
   */
  readonly series: readonly CartesianSeries[];

  /**
   * Writes a series' value in the tooltip.
   */
  readonly write: (value: unknown, entry?: TooltipEntry) => string;
}

/**
 * Returns the tooltip's writer of values with the change from the earlier period after the value
 * of each series another series is the earlier period of, or the writer as it is without one.
 *
 * @remarks
 *   A row without a finite earlier value, or with an earlier value of zero, writes no change.
 * @param options - The locale, the series and the writer of values.
 */
export function changeWordsOf({
  locale,
  series,
  write,
}: ChangeOptions): (value: unknown, entry?: TooltipEntry) => string {
  const earlier = new Map(
    series.flatMap((each) =>
      each.previousOf === undefined ? [] : [[each.previousOf, each.key] as const],
    ),
  );

  if (earlier.size === 0) return write;

  const percent = new Intl.NumberFormat(locale, CHANGE);
  const separator = separatorOf(locale);

  return (value, entry) => {
    const words = write(value, entry);
    const key = earlier.get(keyOf(entry));
    const now = finiteOf(value);
    const before = key === undefined ? undefined : finiteAt(entry?.payload, key);

    return now === undefined || before === undefined || before === 0
      ? words
      : `${words}${separator}${percent.format((now - before) / Math.abs(before))}`;
  };
}
