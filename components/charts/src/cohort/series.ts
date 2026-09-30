/**
 * Lays retention out as a line chart: a row per period with each cohort's rate, and the
 * size-weighted average across the cohorts, solid while enough cohorts have a rate at the period
 * and dashed after.
 *
 * @remarks
 *   At the far periods only the oldest cohorts have a rate, so the average there is the average of
 *   those few, and a curve that flattens there flattened because the cohorts changed. The average
 *   renders as two series, a solid one while at least `minCohorts` cohorts have a rate and a dashed
 *   one after, which share the last solid period so the line joins. Every cohort takes one color,
 *   each newer cohort mixed further towards the ink, so the order of the cohorts reads as strength
 *   and every line keeps 3:1 or more against the page. The average is the ink.
 */

import { type ReactNode } from "react";

import { type CartesianSeries } from "#cartesian/types.ts";
import { type ChartColor } from "#chart/colors.ts";
import { type Cohort, cohortAverages, retentionRate } from "#cohort/cohorts.ts";

/**
 * Describes a row of a retention chart: the period's words, each cohort's rate under its series
 * key, and the average split into its solid and its dashed part.
 */
export interface RetentionRow {
  /**
   * Words of the period.
   */
  readonly period: string;

  /**
   * Rate of a cohort under `cohortSeriesKey` of its key, the average, or its dashed part.
   */
  readonly [key: string]: null | number | string;
}

/**
 * Describes the words and the colors of a retention chart.
 */
export interface RetentionOptions {
  /**
   * Name of the average. "All cohorts" unless stated.
   */
  readonly averageLabel?: ReactNode;

  /**
   * Color every line mixes from. The theme's first series color unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * How many cohorts need a rate at a period for the average to render solid there. 3 unless
   * stated.
   */
  readonly minCohorts?: number | undefined;

  /**
   * Returns the words of a period, such as "M3". The period's number unless stated.
   */
  readonly periodLabel?: ((period: number) => string) | undefined;

  /**
   * Name of the dashed part of the average. "All cohorts, few old enough" unless stated.
   */
  readonly sparseLabel?: ReactNode;
}

/**
 * Describes the line chart props of a retention chart: the rows, the series, a value axis from 0
 * to 1 and rates written as percentages.
 */
export interface Retention {
  /**
   * Field of each row the category axis reads, the period's words.
   */
  readonly categoryKey: "period";

  /**
   * A row per period.
   */
  readonly data: RetentionRow[];

  /**
   * A line per cohort, oldest first, then the average's solid and dashed parts while they have a
   * value.
   */
  readonly series: readonly CartesianSeries[];

  /**
   * Domain of the value axis, from 0 to 1.
   */
  readonly valueDomain: [number, number];

  /**
   * Options a rate is written with, as a percentage.
   */
  readonly valueOptions: Intl.NumberFormatOptions;
}

/**
 * Key of the average's solid part.
 */
const AVERAGE = "average";

/**
 * Key of the average's dashed part.
 */
const SPARSE = "sparse";

/**
 * Share of the ink, in percent, the newest cohort's line mixes in. The oldest mixes in none.
 */
const NEWEST = 60;

/**
 * Returns the series key of a cohort's rate from the cohort's key, which no other field of a row
 * takes.
 *
 * @remarks
 *   The key is `cohort:` and the cohort's key URI-encoded with its dots as `%2E`, because recharts
 *   reads a dot or a bracket in a key as a path. Two cohort keys never share a series key.
 */
export function cohortSeriesKey(key: string): string {
  return `cohort:${encodeURIComponent(key).replaceAll(".", "%2E")}`;
}

/**
 * Returns the rows of a retention chart: each cohort's rate and the average's two parts per period.
 */
function rowsOf(
  cohorts: readonly Cohort[],
  floor: number,
  label: (period: number) => string,
): RetentionRow[] {
  const averages = cohortAverages(cohorts);
  const thin = averages.map(
    (_, period) =>
      cohorts.filter((cohort) => retentionRate(cohort, period) !== null).length < floor,
  );

  return averages.map((value, period) => {
    const rates = Object.fromEntries(
      cohorts.map((cohort) => [cohortSeriesKey(cohort.key), retentionRate(cohort, period)]),
    );

    return Object.assign(rates, {
      [AVERAGE]: thin[period] === true ? null : value,
      period: label(period),
      [SPARSE]: thin[period] === true || thin[period + 1] === true ? value : null,
    });
  });
}

/**
 * Returns the line chart props of a retention chart: a row per period, a line per cohort, and the
 * average's solid and dashed parts.
 *
 * @param cohorts - The cohorts, oldest first.
 * @param options - The words, the color and how many cohorts make the average solid.
 * @returns The props to spread into `LineChart`.
 */
export function retentionSeries(
  cohorts: readonly Cohort[],
  options: RetentionOptions = {},
): Retention {
  const { color = "series.1", minCohorts = 3, periodLabel = String } = options;
  const data = rowsOf(cohorts, minCohorts, periodLabel);
  const curves = cohorts.map((cohort, at) => ({
    color,
    ink: cohorts.length < 2 ? 0 : Math.round((NEWEST * at) / (cohorts.length - 1)),
    key: cohortSeriesKey(cohort.key),
    label: cohort.label,
  }));
  const average = { color, ink: 100, key: AVERAGE, label: options.averageLabel ?? "All cohorts" };
  const sparse = {
    color,
    dashed: true,
    ink: 100,
    key: SPARSE,
    label: options.sparseLabel ?? "All cohorts, few old enough",
  };

  return {
    categoryKey: "period",
    data,
    series: [
      ...curves,
      ...(data.some((row) => row[AVERAGE] !== null) ? [average] : []),
      ...(data.some((row) => row[SPARSE] !== null) ? [sparse] : []),
    ],
    valueDomain: [0, 1],
    valueOptions: { style: "percent" },
  };
}
