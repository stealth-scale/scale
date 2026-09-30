/**
 * Exports the funnel chart and the functions that resolve its stages into steps.
 */

export { FunnelChart, type FunnelChartProps } from "#funnel-chart/funnel-chart.tsx";
export {
  biggestDrop,
  type FunnelStage,
  type FunnelStep,
  funnelSteps,
  funnelWidenings,
} from "#funnel-chart/steps.ts";
