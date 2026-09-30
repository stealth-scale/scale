/**
 * Exports the cohort helpers: a cohort's retention rate, the size-weighted averages, the heatmap
 * props of a cohort grid, and the line chart props of a retention chart.
 */

export {
  type Cohort,
  cohortAverages,
  type CohortCell,
  cohortCells,
  type CohortGrid,
  type CohortOptions,
  retentionRate,
} from "#cohort/cohorts.ts";
export {
  cohortSeriesKey,
  type Retention,
  type RetentionOptions,
  type RetentionRow,
  retentionSeries,
} from "#cohort/series.ts";
