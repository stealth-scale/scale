/**
 * Renders a radar chart: each series' values across several dimensions, as a polygon on one spoke
 * per dimension.
 *
 * @remarks
 *   Every spoke reads one radius axis, so the dimensions must share a scale, and `valueDomain`
 *   states it, such as `[0, 10]` for scores out of ten. The polygon's shape follows the order of
 *   the spokes: two orders of the same scores render two shapes, so a radar shows a profile, and a
 *   bar chart compares values. Each polygon fills at 0.25 of its color unless its series states
 *   `filled: false`, which leaves the outline for three series or more. The tooltip names the spoke
 *   and writes each series' value, and the arrows walk the spokes.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart as RechartsRadarChart,
  Tooltip,
} from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { type Formats, formatsOf } from "#cartesian/formats.ts";
import { type CartesianProps } from "#cartesian/types.ts";
import * as Chart from "#chart/index.ts";
import { type SeriesOptions } from "#chart/use-chart.ts";
import { polygonsOf, type PolygonsOptions } from "#radar-chart/polygons.tsx";

/**
 * Message the chart renders without rows unless it states one.
 */
const EMPTY = "No data";

/**
 * Angle of the radius axis: the spoke at 12 o'clock, the one angle recharts writes the ticks level
 * at.
 */
const UPRIGHT = 90;

/**
 * Radius of the web as a share of the largest circle the plot fits. At recharts' 80% a spoke named
 * "Throughput" ran 7px past a 320 by 240 plot; at 72% it fits with 2px to spare.
 */
const RADIUS = "72%";

/**
 * Number of ticks on the radius axis, which the web's rings follow. At six, recharts steps a top of
 * 1, 5, 10 or 100 evenly, where five ticks give 0, 3, 6, 9 and 10 for a top of 10.
 */
const TICKS = 6;

/**
 * Describes a series of a radar chart: the kit's series, and whether its polygon fills.
 */
export interface RadarSeries extends SeriesOptions {
  /**
   * Whether the polygon fills at 0.25 of its color. Filled unless stated.
   */
  readonly filled?: boolean | undefined;
}

/**
 * Describes the props of a radar chart: the cartesian props, its series and the radius ticks.
 *
 * @remarks
 *   The figure's props leave out `scale`, the style prop, because the chart takes `scale` as the
 *   switch of its radius ticks. The props leave out `annotations`, because the spokes are not a
 *   category axis to mark.
 * @typeParam Row - One row of the data, one per spoke.
 */
export interface RadarChartProps<Row> extends Omit<
  CartesianProps<Row>,
  "annotations" | "scale" | "series"
> {
  /**
   * Whether the radius axis writes its ticks up the spoke at 12 o'clock.
   */
  readonly scale?: boolean | undefined;

  /**
   * Series the chart plots, in the order the legend lists them.
   */
  readonly series: readonly RadarSeries[];
}

/**
 * Describes what the recharts radar chart is built from.
 */
interface RadarOptions extends PolygonsOptions {
  /**
   * Field of each row the spokes read their names from.
   */
  readonly categoryKey: string;

  /**
   * Recharts elements rendered after the polygons.
   */
  readonly children: ReactNode;

  /**
   * Index of the spoke the tooltip shows on the first render.
   */
  readonly defaultIndex: number | undefined;

  /**
   * Formatters of the spokes' names, the ticks and the tooltip's values.
   */
  readonly formats: Formats;

  /**
   * Whether the web of rings and spokes renders.
   */
  readonly grid: boolean;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Whether the radius axis writes its ticks.
   */
  readonly scale: boolean;

  /**
   * Domain of the radius axis in recharts' terms.
   */
  readonly valueDomain: CartesianProps<object>["valueDomain"];
}

/**
 * Returns recharts' radar chart: the web, the spokes' names, the radius axis, the tooltip, the
 * polygons and the caller's children.
 *
 * @param options - The chart, the formatters, the switches and the words.
 */
function radarOf(options: RadarOptions): ReactElement {
  const { chart, defaultIndex, formats, valueDomain } = options;

  return (
    <RechartsRadarChart
      accessibilityLayer
      data={chart.data}
      outerRadius={RADIUS}
      title={options.label}
    >
      {options.grid ? <PolarGrid /> : null}
      <PolarAngleAxis
        dataKey={options.categoryKey}
        {...omitUndefined({ tickFormatter: formats.label })}
      />
      <PolarRadiusAxis
        allowDecimals
        angle={UPRIGHT}
        axisLine={false}
        {...omitUndefined({ domain: valueDomain })}
        tick={options.scale}
        tickCount={TICKS}
        tickFormatter={formats.tick}
      />
      <Tooltip
        content={<Chart.Tooltip formatLabel={formats.label} formatValue={formats.value} />}
        {...omitUndefined({ defaultIndex })}
      />
      {polygonsOf(options)}
      {options.children}
    </RechartsRadarChart>
  );
}

/**
 * Renders the chart's figure around a polygon per series, the legend and the caption.
 *
 * @typeParam Row - One row of the data, one per spoke.
 * @param props - The rows, the series, the words and the switches.
 */
export function RadarChart<Row>({
  animate = false,
  caption,
  categoryKey,
  children,
  data,
  defaultHiddenKeys,
  defaultIndex,
  empty = EMPTY,
  grid = true,
  hiddenKeys,
  label,
  labelOptions,
  legend,
  legendLabel,
  locale,
  onHiddenKeysChange,
  ratio = "landscape",
  scale = false,
  series,
  valueDomain,
  valueOptions,
  ...root
}: RadarChartProps<Row>): ReactElement {
  const options = { data, defaultHiddenKeys, hiddenKeys, locale, onHiddenKeysChange, series };
  const chart = Chart.useChart(options);
  const formats = formatsOf(chart, { labelOptions, stack: "none", valueOptions });
  const unfilled = new Set(series.filter((each) => each.filled === false).map((each) => each.key));
  const plot = { animate, categoryKey, chart, children, defaultIndex, formats, grid, label };
  const legended = (legend ?? series.length > 1) && chart.data.length > 0;

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot>{radarOf({ ...plot, scale, unfilled, valueDomain })}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legended ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
