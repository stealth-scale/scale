/**
 * Lays retention out by cohort: the share of each intake still present at each period since it
 * arrived, as a heatmap's cells or as a line chart's rows and series.
 *
 * @remarks
 *   A cohort states how many arrived and how many remained at each period, index 0 being the
 *   period it arrived in. The length of `retained` is how far the cohort is observed: a `null`
 *   inside it is a count nobody measured, and a period past its end has not happened yet, which a
 *   heatmap renders as an empty place and a line chart as no point. A rate is `retained / size`,
 *   and a cohort of none has no rate. An average weighs each cohort by its size and counts only the
 *   cohorts with a rate at the period, so a large cohort outweighs a small one and young cohorts do
 *   not pull the tail down.
 */

import { type HeatmapDomain } from "#heat/scale.ts";
import { type HeatmapCell, type HeatmapHeading } from "#heatmap/cells.ts";

/**
 * Describes one intake: who arrived together and how many of them remained at each period since.
 */
export interface Cohort {
  /**
   * Key of the cohort, unique among the cohorts.
   */
  readonly key: string;

  /**
   * Words that name the cohort, such as "Jan 2026".
   */
  readonly label: string;

  /**
   * How many remained at each period since the cohort arrived, as far as it is observed, with
   * `null` for a count nobody measured.
   */
  readonly retained: ReadonlyArray<null | number>;

  /**
   * How many arrived, the denominator of every rate of the cohort.
   */
  readonly size: number;
}

/**
 * Describes a heatmap cell of a cohort grid, which `onSelect` receives with its cohort, its period
 * and its count.
 */
export interface CohortCell extends HeatmapCell {
  /**
   * Cohort of the cell, or undefined for the average's cell.
   */
  readonly cohort: Cohort | undefined;

  /**
   * Period of the cell, 0 being the period the cohort arrived in.
   */
  readonly period: number;

  /**
   * How many remained, or `null` for the average and for a count nobody measured.
   */
  readonly retained: null | number;
}

/**
 * Describes the words of a cohort grid and what its cells write.
 */
export interface CohortOptions {
  /**
   * Words of a last row of the size-weighted rate per period, which renders while stated.
   */
  readonly average?: string | undefined;

  /**
   * Returns the words of a cohort's row, such as its label with its size. The cohort's label unless
   * stated.
   */
  readonly label?: ((cohort: Cohort) => string) | undefined;

  /**
   * Locale the counts are written in.
   */
  readonly locale: string;

  /**
   * Value a cohort's cells write: the rate, or the count that remained. The fill is the rate either
   * way. `rate` unless stated.
   */
  readonly measure?: "count" | "rate" | undefined;

  /**
   * Returns the words of a period's column, such as "M3". The period's number unless stated.
   */
  readonly periodLabel?: ((period: number) => string) | undefined;
}

/**
 * Describes the heatmap props of a cohort grid: its cells, its periods, its cohorts, rates on a
 * scale from 0 to 1 written as percentages, and a sparse grid.
 */
export interface CohortGrid {
  /**
   * Cells of the observed periods of each cohort, and of the average.
   */
  readonly cells: readonly CohortCell[];

  /**
   * Periods, from 0 to the widest cohort's last.
   */
  readonly columns: readonly HeatmapHeading[];

  /**
   * Scale of the rates, from 0 to 1.
   */
  readonly domain: HeatmapDomain;

  /**
   * Cohorts in order, then the average while it renders.
   */
  readonly rows: readonly HeatmapHeading[];

  /**
   * Whether a period past a cohort's last count is an empty place, which it is.
   */
  readonly sparse: true;

  /**
   * Options a rate is written with, as a percentage.
   */
  readonly valueOptions: Intl.NumberFormatOptions;
}

/**
 * Key of the average's row, which no cohort's row takes, because each cohort's row key starts with
 * `cohort:`.
 */
const AVERAGE = "average";

/**
 * Returns the share of a cohort that remained at a period, 0 being the period it arrived in, or
 * `null` without a count or without anyone in the cohort.
 */
export function retentionRate(cohort: Cohort, period: number): null | number {
  const retained = cohort.retained[period] ?? null;

  return retained === null || cohort.size <= 0 ? null : retained / cohort.size;
}

/**
 * Returns how many periods the widest cohort is observed for.
 */
function periodsOf(cohorts: readonly Cohort[]): number {
  return Math.max(0, ...cohorts.map((cohort) => cohort.retained.length));
}

/**
 * Returns the share of the cohorts that remained at each period, each cohort weighed by its size,
 * over the cohorts with a rate at the period, or `null` at a period without one.
 */
export function cohortAverages(cohorts: readonly Cohort[]): ReadonlyArray<null | number> {
  return Array.from({ length: periodsOf(cohorts) }, (_, period) => {
    const counted = cohorts.flatMap(({ retained, size }) => {
      const at = retained[period] ?? null;

      return at === null || size <= 0 ? [] : [{ at, size }];
    });
    const size = counted.reduce((sum, each) => sum + each.size, 0);

    return size === 0 ? null : counted.reduce((sum, each) => sum + each.at, 0) / size;
  });
}

/**
 * Returns the heatmap props of a cohort grid: a row per cohort, a column per period, a cell per
 * observed period of each cohort filled from its rate, and a last row of the averages while
 * `average` names it.
 *
 * @param cohorts - The cohorts, oldest first.
 * @param options - The words, the locale and what the cells write.
 * @returns The props to spread into `Heatmap`.
 */
export function cohortCells(cohorts: readonly Cohort[], options: CohortOptions): CohortGrid {
  const { average, measure = "rate" } = options;
  const count = new Intl.NumberFormat(options.locale);
  const cells = cohorts.flatMap((cohort) =>
    cohort.retained.map((retained, period) => ({
      cohort,
      column: String(period),
      period,
      retained,
      row: `cohort:${cohort.key}`,
      text: measure === "count" && retained !== null ? count.format(retained) : undefined,
      value: retentionRate(cohort, period),
    })),
  );
  const averages = cohortAverages(cohorts).map((value, period) => ({
    cohort: undefined,
    column: String(period),
    period,
    retained: null,
    row: AVERAGE,
    value,
  }));

  return {
    cells: average === undefined ? cells : [...cells, ...averages],
    columns: Array.from({ length: periodsOf(cohorts) }, (_, period) => ({
      key: String(period),
      label: options.periodLabel?.(period) ?? String(period),
    })),
    domain: { max: 1, min: 0 },
    rows: [
      ...cohorts.map((cohort) => ({
        key: `cohort:${cohort.key}`,
        label: options.label?.(cohort) ?? cohort.label,
      })),
      ...(average === undefined ? [] : [{ key: AVERAGE, label: average }]),
    ],
    sparse: true,
    valueOptions: { style: "percent" },
  };
}
