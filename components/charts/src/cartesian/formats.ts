/**
 * Builds a cartesian preset's formatters from its `Intl` options, so its ticks and its tooltip
 * write a value with one function.
 */

import { type Shape } from "#cartesian/types.ts";
import { type TooltipEntry } from "#chart/tooltip.tsx";
import { type ChartApi } from "#chart/use-chart.ts";

/**
 * Options the value ticks of a stack summed to 100% are written with: whole percentages.
 */
const PERCENT: Intl.NumberFormatOptions = { maximumFractionDigits: 0, style: "percent" };

/**
 * Describes a preset's formatters.
 */
export interface Formats {
  /**
   * Writes a value on a tick of the end axis.
   */
  readonly end: (value: unknown) => string;

  /**
   * Writes a category on its tick and in the tooltip's heading, where label options are stated.
   */
  readonly label: ((value: unknown) => string) | undefined;

  /**
   * Writes a value on a tick of the start axis.
   */
  readonly tick: (value: unknown) => string;

  /**
   * Writes a series' value in the tooltip, in the format of the axis the series reads.
   */
  readonly value: (value: unknown, entry?: TooltipEntry) => string;
}

/**
 * Describes the options a preset's formatters are built from.
 */
export interface FormatOptions {
  /**
   * Keys of the series that read the end axis.
   */
  readonly endKeys?: readonly string[] | undefined;

  /**
   * `Intl.NumberFormat` options for the end axis and its series' values.
   */
  readonly endOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * `Intl.DateTimeFormat` options for the categories, for a time axis.
   */
  readonly labelOptions?: Intl.DateTimeFormatOptions | undefined;

  /**
   * How the preset's series stack.
   */
  readonly stack: Shape["stack"];

  /**
   * `Intl.NumberFormat` options for the values.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;
}

/**
 * Returns the key of the series an entry belongs to: its field, or its name for a band, whose
 * field is a function.
 */
export function keyOf(entry: TooltipEntry | undefined): string {
  if (typeof entry?.dataKey === "string") return entry.dataKey;

  return typeof entry?.name === "string" ? entry.name : "";
}

/**
 * Returns a preset's formatters in the chart's locale.
 *
 * @remarks
 *   A stack summed to 100% writes its value ticks as whole percentages and its tooltip's values
 *   with `valueOptions`, because recharts passes the tooltip each series' own value, not its share.
 *   A series on the end axis writes its tooltip value with `endOptions`.
 * @param chart - The chart the formatters write in the locale of.
 * @param options - The label, value and end options, the end axis' series and the stack.
 */
export function formatsOf(chart: ChartApi, options: FormatOptions): Formats {
  const value = chart.formatNumber(options.valueOptions);
  const end = chart.formatNumber(options.endOptions);
  const ends = new Set(options.endKeys);

  return {
    end,
    label: options.labelOptions === undefined ? undefined : chart.formatDate(options.labelOptions),
    tick: options.stack === "percent" ? chart.formatNumber(PERCENT) : value,
    value: (each, entry) => (ends.has(keyOf(entry)) ? end : value)(each),
  };
}
