/**
 * Exports the burndown chart and the functions that build its rows and name its finish.
 */

export { BurndownChart, type BurndownChartProps } from "#burndown-chart/burndown-chart.tsx";
export {
  burndownFinish,
  type BurndownOptions,
  type BurndownPoint,
  type BurndownRow,
  burndownRows,
} from "#burndown-chart/rows.ts";
