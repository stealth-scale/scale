/**
 * Exports the parts of a chart, the hook that resolves the chart they read, and the CSS value of a
 * palette's chart color.
 */

export { Caption, type CaptionProps } from "#chart/caption.tsx";
export { type ChartColor, colorOf } from "#chart/colors.ts";
export { Crosshair, type CrosshairProps } from "#chart/crosshair.tsx";
export { Empty, type EmptyProps } from "#chart/empty.tsx";
export { KeyItem, type KeyItemProps } from "#chart/key-item.tsx";
export { Key, type KeyProps } from "#chart/key.tsx";
export { Legend, type LegendProps } from "#chart/legend.tsx";
export { Plot, type PlotProps } from "#chart/plot.tsx";
export { Root, type RootProps } from "#chart/root.tsx";
export {
  Tooltip,
  type TooltipEntry,
  type TooltipNote,
  type TooltipProps,
  type TooltipRow,
} from "#chart/tooltip.tsx";
export {
  type ChartApi,
  type ChartOptions,
  type Series,
  type SeriesOptions,
  useChart,
} from "#chart/use-chart.ts";
