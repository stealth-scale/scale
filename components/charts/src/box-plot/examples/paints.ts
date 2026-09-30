/**
 * Lists the summaries a warehouse query returns for a month of page loads on three kinds of
 * device: the time to the largest contentful paint in seconds, with the slowest loads as the
 * outliers.
 */

import { type BoxSummary } from "#stats/index.ts";

/**
 * Summarises 1,284,310 loads on desktops.
 */
export const DESKTOP: BoxSummary = {
  count: 1_284_310,
  iqr: 0.7,
  max: 5.2,
  median: 1.2,
  min: 0.4,
  outliers: [3.4, 4.1, 5.2],
  q1: 0.9,
  q3: 1.6,
  whiskerHigh: 2.6,
  whiskerLow: 0.4,
};

/**
 * Summarises 212,904 loads on tablets.
 */
export const TABLET: BoxSummary = {
  count: 212_904,
  iqr: 1.1,
  max: 6.3,
  median: 1.8,
  min: 0.6,
  outliers: [5.1, 6.3],
  q1: 1.3,
  q3: 2.4,
  whiskerHigh: 4,
  whiskerLow: 0.6,
};

/**
 * Summarises 2,730,518 loads on phones.
 */
export const MOBILE: BoxSummary = {
  count: 2_730_518,
  iqr: 1.6,
  max: 9.6,
  median: 2.4,
  min: 0.8,
  outliers: [7.2, 8.4, 9.6],
  q1: 1.7,
  q3: 3.3,
  whiskerHigh: 5.7,
  whiskerLow: 0.8,
};
