/**
 * Lists the readings of the heatmap's page: a week of card authorisations per hour, beds occupied
 * per ward, build minutes per pipeline, parcels scanned per depot this week and last week,
 * headcount against plan per team, 5xx responses per service, and attendance per school day across
 * a teaching year.
 */

import { type HeatmapCell, type HeatmapHeading } from "#heatmap/index.ts";

/**
 * Keys of the days of the week, Monday first.
 */
export const WEEKDAYS: readonly string[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/**
 * Keys of the working days, Monday to Friday.
 */
export const WORKDAYS: readonly string[] = WEEKDAYS.slice(0, 5);

/**
 * Keys of the trading hours, from 08 to 19.
 */
export const TRADING_HOURS: readonly string[] = Array.from({ length: 12 }, (_, at) =>
  String(at + 8).padStart(2, "0"),
);

/**
 * Returns the headings of hours from their keys, each written as the hour on the clock, such as
 * "17:00" for "17".
 *
 * @param keys - The hours' two-digit keys, in order.
 */
export function hoursOf(keys: readonly string[]): readonly HeatmapHeading[] {
  return keys.map((key) => ({ key, label: `${key}:00` }));
}

/**
 * Returns readings from a row of values per row key, in the columns' order. A short row leaves the
 * rest of its cells missing.
 *
 * @param columns - The columns' keys, in order.
 * @param rows - Each row's key with its values.
 */
export function gridOf(
  columns: readonly string[],
  rows: ReadonlyArray<readonly [string, ReadonlyArray<null | number>]>,
): readonly HeatmapCell[] {
  return rows.flatMap(([row, values]) =>
    columns.map((column, at) => ({ column, row, value: values[at] ?? null })),
  );
}

/**
 * Lists a week of card authorisations per hour: a lunchtime peak, a larger evening peak at 17:00,
 * and a weekend at 40% of a working day. Tuesday at 17:00 is the busiest hour, with 405.
 */
export const AUTHORISATIONS: readonly HeatmapCell[] = WEEKDAYS.flatMap((row, day) =>
  TRADING_HOURS.map((column, hour) => {
    const lunchtime = Math.max(0, 9 - Math.abs(hour - 4) * 3);
    const evening = Math.max(0, 11 - Math.abs(hour - 9) * 2);
    const weekend = day > 4 ? 0.4 : 1;

    return {
      column,
      row,
      value: Math.round(((lunchtime + evening) * weekend + ((day * 7 + hour * 3) % 5)) * 27),
    };
  }),
);

/**
 * Keys of the wards.
 */
export const WARDS: readonly string[] = [
  "cardiology",
  "neurology",
  "oncology",
  "paediatrics",
  "respiratory",
];

/**
 * Lists the beds occupied per ward on the working days of one week. The oncology feed was down all
 * week and nobody counted paediatrics on Wednesday: six readings are missing, beside real counts
 * as low as 8.
 */
export const OCCUPANCY: readonly HeatmapCell[] = gridOf(WORKDAYS, [
  ["cardiology", [22, 24, 23, 26, 21]],
  ["neurology", [14, 12, 15, 17, 13]],
  ["oncology", [null, null, null, null, null]],
  ["paediatrics", [9, 11, null, 12, 8]],
  ["respiratory", [18, 19, 21, 24, 20]],
]);

/**
 * Keys of the pipelines.
 */
export const PIPELINES: readonly string[] = [
  "checkout-api",
  "ledger-worker",
  "payments-web",
  "risk-engine",
];

/**
 * Lists the build minutes per pipeline on the working days of one week. Friday is when everyone
 * merges: payments-web builds for 388 minutes then.
 */
export const BUILD_MINUTES: readonly HeatmapCell[] = gridOf(WORKDAYS, [
  ["checkout-api", [128, 143, 96, 212, 341]],
  ["ledger-worker", [64, 71, 58, 88, 154]],
  ["payments-web", [186, 174, 203, 241, 388]],
  ["risk-engine", [42, 55, 37, 61, 119]],
]);

/**
 * Keys of the depots.
 */
export const DEPOTS: readonly string[] = ["antwerpen", "duisburg", "rotterdam"];

/**
 * Keys of the depots' hours, every second hour from 06 to 16.
 */
export const DEPOT_HOURS: readonly string[] = ["06", "08", "10", "12", "14", "16"];

/**
 * Lists the parcels scanned per depot and hour this week: from 590 to 1,940.
 */
export const SCANS_THIS_WEEK: readonly HeatmapCell[] = gridOf(DEPOT_HOURS, [
  ["antwerpen", [980, 1420, 1610, 1290, 940, 720]],
  ["duisburg", [760, 1120, 1380, 1040, 810, 590]],
  ["rotterdam", [1240, 1810, 1940, 1520, 1180, 860]],
]);

/**
 * Lists the parcels scanned per depot and hour last week: the same shape at about half the volume,
 * from 320 to 1,060.
 */
export const SCANS_LAST_WEEK: readonly HeatmapCell[] = gridOf(DEPOT_HOURS, [
  ["antwerpen", [540, 790, 880, 700, 510, 390]],
  ["duisburg", [410, 620, 750, 570, 440, 320]],
  ["rotterdam", [690, 980, 1060, 840, 650, 470]],
]);

/**
 * Keys of the teams.
 */
export const TEAMS: readonly string[] = [
  "customer-success",
  "data-platform",
  "design",
  "payments",
  "security",
];

/**
 * Keys of the quarters.
 */
export const QUARTERS: readonly string[] = ["q1", "q2", "q3", "q4"];

/**
 * Lists the headcount against plan per team and quarter: payments at 9 under plan in Q2 is the
 * furthest under, security at 11 over in Q4 the furthest over.
 */
export const HEADCOUNT_VARIANCE: readonly HeatmapCell[] = gridOf(QUARTERS, [
  ["customer-success", [-3, -1, 2, 4]],
  ["data-platform", [1, 3, 6, 9]],
  ["design", [0, -2, -4, -5]],
  ["payments", [-6, -9, -4, 1]],
  ["security", [2, 2, 5, 11]],
]);

/**
 * Keys of the services.
 */
export const SERVICES: readonly string[] = [
  "auth-gateway",
  "checkout-api",
  "ledger-worker",
  "search-index",
];

/**
 * Keys of the hours of the morning checkout-api failed, from 09 to 14.
 */
export const INCIDENT_HOURS: readonly string[] = ["09", "10", "11", "12", "13", "14"];

/**
 * Lists the 5xx responses per service and hour the morning checkout-api failed: 512 at 12:00.
 */
export const ERRORS: readonly HeatmapCell[] = gridOf(INCIDENT_HOURS, [
  ["auth-gateway", [2, 1, 4, 3, 2, 1]],
  ["checkout-api", [6, 9, 148, 512, 96, 12]],
  ["ledger-worker", [0, 0, 2, 34, 8, 1]],
  ["search-index", [11, 8, 14, 22, 17, 9]],
]);

/**
 * Keys of the teaching weeks, from 1 to 36.
 */
export const TERM_WEEKS: readonly string[] = Array.from({ length: 36 }, (_, at) => String(at + 1));

/**
 * Lists the share of pupils present per school day and teaching week, in percent: from 97% down to
 * 82% at the bottom of a dip through the winter term, in weeks 15 and 16.
 */
export const ATTENDANCE: readonly HeatmapCell[] = WORKDAYS.flatMap((row, day) =>
  TERM_WEEKS.map((column, week) => ({
    column,
    row,
    value: 97 - Math.max(0, 9 - Math.abs(week - 14)) - day - ((week * 5 + day * 3) % 4),
  })),
);
