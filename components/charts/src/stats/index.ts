/**
 * Exports the statistics the distribution charts render, for a caller that summarises values
 * elsewhere and has to match the chart.
 */

export { boxStats, type BoxSummary } from "#stats/box.ts";
export {
  type DensityOptions,
  densityPeaks,
  type DensityPoint,
  kernelDensity,
  silvermanBandwidth,
} from "#stats/density.ts";
export { quantile } from "#stats/quantile.ts";
