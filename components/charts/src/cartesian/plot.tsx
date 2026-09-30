/**
 * Renders a cartesian preset's recharts chart: the gradients, the grid, the axes, the tooltip, the
 * marks, the annotations and the caller's children.
 *
 * @remarks
 *   The plot renders the recharts chart of the preset's mark, because only recharts' bar chart puts
 *   a band under the pointer, and a composed chart where the series state their own marks. The
 *   value axis of a stack about a moving baseline renders no ticks, because no value reads off a
 *   band against it. Its domain fits the stack unless the preset states one, so the stack fills the
 *   plot from its top edge to its bottom edge.
 */

import { type ReactElement } from "react";

import {
  AreaChart,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LineChart,
  type YAxisProps,
} from "recharts";

import { annotationMarksOf } from "#cartesian/annotation-marks.tsx";
import { axesOf } from "#cartesian/axes.tsx";
import { formatsOf } from "#cartesian/formats.ts";
import { fillsOf, marksOf } from "#cartesian/marks.tsx";
import { tooltipOf } from "#cartesian/tooltip.tsx";
import { type CartesianCoreProps, type Shape } from "#cartesian/types.ts";
import { type ChartApi } from "#chart/use-chart.ts";

/**
 * Maps a mark to the recharts chart that renders it.
 */
const SURFACES = { area: AreaChart, bar: BarChart, line: LineChart, mixed: ComposedChart };

/**
 * Maps a stack to recharts' offset: `expand` sums every point to 1, `wiggle` and `silhouette`
 * move the baseline.
 */
const OFFSETS = {
  none: "none",
  percent: "expand",
  silhouette: "silhouette",
  stacked: "none",
  wiggle: "wiggle",
} as const;

/**
 * Domain of a value axis that fits the data exactly, with no room rounded on at either end.
 */
const FIT: YAxisProps["domain"] = ["dataMin", "dataMax"];

/**
 * Describes the props the recharts chart is built from.
 *
 * @typeParam Row - One row of the data.
 */
export type PlotProps<Row> = Pick<
  CartesianCoreProps<Row>,
  | "animate"
  | "annotations"
  | "categoryKey"
  | "children"
  | "defaultIndex"
  | "endDomain"
  | "endOptions"
  | "grid"
  | "label"
  | "labelOptions"
  | "series"
  | "shape"
  | "stackOrder"
  | "targetLabel"
  | "valueDomain"
  | "valueOptions"
  | "zones"
>;

/**
 * Describes the recharts chart a shape renders in, with the props the shape fixes on it.
 */
interface Surfaced {
  /**
   * Whether recharts' keyboard layer is on, which it always is.
   */
  readonly accessibilityLayer: true;

  /**
   * Direction recharts lays the chart out in. `vertical` puts bars on their side.
   */
  readonly layout: "horizontal" | "vertical";

  /**
   * How recharts offsets stacked series.
   */
  readonly stackOffset: (typeof OFFSETS)[Shape["stack"]];

  /**
   * Recharts chart the shape's mark renders in.
   */
  readonly Surface: (typeof SURFACES)[Shape["mark"]];
}

/**
 * Returns recharts' chart of a shape with its keyboard layer, its layout and its stack offset.
 *
 * @param shape - The preset's shape.
 */
function surfaceOf(shape: Shape): Surfaced {
  return {
    accessibilityLayer: true,
    layout: shape.direction === "horizontal" ? ("vertical" as const) : ("horizontal" as const),
    stackOffset: OFFSETS[shape.stack],
    Surface: SURFACES[shape.mark],
  };
}

/**
 * Returns recharts' chart of the plot: the gradients, the grid, the axes, the tooltip, the marks,
 * the annotations and the caller's children.
 *
 * @typeParam Row - One row of the data.
 * @param chart - The chart the plot renders.
 * @param gradient - The prefix of the gradients' IDs, unique to the chart.
 * @param props - The props the plot is built from.
 */
export function plotOf<Row>(
  chart: ChartApi,
  gradient: string,
  props: PlotProps<Row>,
): ReactElement {
  const { animate = false, annotations = [], children, grid = true, series, shape } = props;
  const zones = props.zones ?? [];
  const endKeys = series.filter((each) => each.axis === "end").map((each) => each.key);
  const { endOptions, labelOptions, valueOptions } = props;
  const formats = formatsOf(chart, {
    endKeys,
    endOptions,
    labelOptions,
    stack: shape.stack,
    valueOptions,
  });
  const { Surface, ...surface } = surfaceOf(shape);
  const upright = surface.layout === "horizontal";
  const moving = shape.stack === "wiggle" || shape.stack === "silhouette";
  const axes = {
    categoryKey: props.categoryKey,
    direction: shape.direction,
    end: endKeys.length > 0 ? { domain: props.endDomain } : undefined,
    formats,
    hidden: moving,
    valueDomain: props.valueDomain ?? (moving ? FIT : undefined),
  };

  return (
    <Surface {...surface} data={chart.data} title={props.label}>
      {fillsOf({ chart, gradient, series, shape })}
      {grid ? <CartesianGrid horizontal={upright} vertical={!upright} /> : null}
      {axesOf(axes)}
      {tooltipOf({
        annotations,
        categoryKey: props.categoryKey,
        chart,
        defaultIndex: props.defaultIndex,
        formats,
        series,
        targetLabel: props.targetLabel,
        zones,
      })}
      {marksOf({ animate, chart, gradient, series, shape, stackOrder: props.stackOrder, zones })}
      {annotationMarksOf({ annotations, upright })}
      {children}
    </Surface>
  );
}
