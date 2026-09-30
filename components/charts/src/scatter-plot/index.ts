/**
 * Exports the scatter plot, its quadrants and the function that spreads crowded points.
 */

export {
  type Division,
  type QuadrantId,
  quadrantOf,
  type Quadrants,
  type SpreadOptions,
  spreadPoints,
} from "#scatter-plot/quadrants.ts";
export { ScatterPlot } from "#scatter-plot/scatter-plot.tsx";
export { type Span } from "#scatter-plot/span.ts";
export { type ScatterPlotProps, type ScatterSeries } from "#scatter-plot/types.ts";
