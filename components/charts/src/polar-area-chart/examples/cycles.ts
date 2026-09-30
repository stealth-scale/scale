/**
 * Lists the cycles the polar area chart's page renders: a day of requests in three-hour buckets, a
 * year of rainfall by month and a month of wind by compass point.
 */

/**
 * Describes one category of a cycle: its key and its value.
 */
export interface Reading {
  /**
   * Key of the category.
   */
  readonly key: string;

  /**
   * Value of the category.
   */
  readonly value: number;
}

/**
 * Lists a day of requests a minute to an API, averaged over three hours from midnight. The load
 * builds from 06:00, peaks at 1,180 at noon and falls by 21:00.
 */
export const HOURS: readonly Reading[] = [
  { key: "00", value: 120 },
  { key: "03", value: 60 },
  { key: "06", value: 210 },
  { key: "09", value: 940 },
  { key: "12", value: 1180 },
  { key: "15", value: 1020 },
  { key: "18", value: 640 },
  { key: "21", value: 300 },
];

/**
 * Requests a minute the API is sized for.
 */
export const CAPACITY = 2000;

/**
 * Lists a year of rainfall by month in millimetres. October is the wettest month at 87mm, and April
 * the driest at 42mm.
 */
export const RAINFALL: readonly Reading[] = [
  { key: "jan", value: 66 },
  { key: "feb", value: 51 },
  { key: "mar", value: 55 },
  { key: "apr", value: 42 },
  { key: "may", value: 53 },
  { key: "jun", value: 62 },
  { key: "jul", value: 76 },
  { key: "aug", value: 83 },
  { key: "sep", value: 78 },
  { key: "oct", value: 87 },
  { key: "nov", value: 84 },
  { key: "dec", value: 77 },
];

/**
 * Lists the hours a month's wind blew from each compass point, from north clockwise. It blew from
 * the south-west for 212 of the 720 hours.
 */
export const WIND: readonly Reading[] = [
  { key: "n", value: 48 },
  { key: "ne", value: 36 },
  { key: "e", value: 42 },
  { key: "se", value: 58 },
  { key: "s", value: 96 },
  { key: "sw", value: 212 },
  { key: "w", value: 164 },
  { key: "nw", value: 64 },
];
