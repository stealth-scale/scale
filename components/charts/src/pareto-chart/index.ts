/**
 * Exports the Pareto chart and the functions that sort its rows and count the categories that
 * add up to a share.
 */

export { ParetoChart, type ParetoChartProps } from "#pareto-chart/pareto-chart.tsx";
export { paretoCutoff, paretoRows, type ParetoShares } from "#pareto-chart/rows.ts";
