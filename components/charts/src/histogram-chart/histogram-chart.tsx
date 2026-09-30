/**
 * Renders a histogram: the shape of one distribution, its values counted into bins that touch along
 * a numeric axis.
 *
 * @remarks
 *   The chart takes values, not rows, because a histogram reads one measure. The bars touch,
 *   because the bins cut one continuous axis into ranges and a gap reads as separate categories,
 *   and the recipe's hairline in the panel's color parts them. The labels are on bin edges at an
 *   even step, and the tooltip heads each bar with its range. `binValues` decides the bins, and
 *   `bins` or `domain` overrides it where the automatic count tells the wrong story.
 */

import { type ReactElement, type ReactNode } from "react";

import { Bar, BarChart, CartesianGrid, Tooltip, YAxis } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { VALUE_CHROME } from "#cartesian/axes.tsx";
import * as Chart from "#chart/index.ts";
import { type RootProps } from "#chart/root.tsx";
import { edgeAxisOf, type EdgeRow, rangeOf } from "#histogram-chart/axis.tsx";
import { BinShape } from "#histogram-chart/bin-shape.tsx";
import { binValues, type ChartBin } from "#histogram-chart/bins.ts";

/**
 * Key of the chart's one series, the field each row's count is in.
 */
const COUNT = "count";

/**
 * Message the chart renders without values unless it states one.
 */
const EMPTY = "No data";

/**
 * Describes one row of the chart: a bin with its count and the middle of its range.
 */
type HistogramRow = ChartBin & EdgeRow;

/**
 * Describes the props of a histogram: the values, the bins, the words, the switches and the
 * figure's props.
 */
export interface HistogramChartProps extends Omit<
  RootProps,
  "chart" | "children" | "color" | "grid"
> {
  /**
   * Whether the bars animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Number of bins to aim for, at most 30. Freedman–Diaconis' count unless stated.
   */
  readonly bins?: number | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the bars, such as a `ReferenceLine`.
   */
  readonly children?: ReactNode;

  /**
   * Palette the bars take their color from. The theme's first series color unless stated.
   */
  readonly color?: Chart.ChartColor | undefined;

  /**
   * Name of the counts in the tooltip.
   */
  readonly countLabel?: ReactNode;

  /**
   * Index of the bin the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Range to bin, which the first bin starts at. The values' own range unless stated. A value
   * outside the bins is left out.
   */
  readonly domain?: readonly [number, number] | undefined;

  /**
   * Message the chart renders in the plot's place while it has no values.
   */
  readonly empty?: ReactNode;

  /**
   * Whether lines cross the plot at the count ticks.
   */
  readonly grid?: boolean | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Response times of the checkout API".
   */
  readonly label: string;

  /**
   * Locale the values are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * `Intl.NumberFormat` options the bin edges are written with, on the axis and in the tooltip.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Values to count, one per thing measured. A value that is not a finite number is left out.
   */
  readonly values: readonly unknown[];
}

/**
 * Returns a row per bin, with the middle of its range.
 */
function rowsOf(bins: readonly ChartBin[]): HistogramRow[] {
  return bins.map(({ count, from, to }) => ({ count, from, middle: (from + to) / 2, to }));
}

/**
 * Describes what the recharts chart is built from.
 */
interface PlotOptions extends Pick<
  HistogramChartProps,
  "children" | "defaultIndex" | "label" | "valueOptions"
> {
  /**
   * Whether the bars animate in.
   */
  readonly animate: boolean;

  /**
   * Chart whose rows the bars render.
   */
  readonly chart: Chart.ChartApi<HistogramRow>;

  /**
   * Whether lines cross the plot at the count ticks.
   */
  readonly grid: boolean;
}

/**
 * Returns recharts' bar chart of the bins: the grid, the edge axis, the count axis, the tooltip,
 * the touching bars and the caller's children.
 *
 * @param options - The chart, the words and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { chart, defaultIndex } = options;
  const format = chart.formatNumber(options.valueOptions);

  return (
    <BarChart accessibilityLayer barCategoryGap={0} data={chart.data} title={options.label}>
      {options.grid ? <CartesianGrid vertical={false} /> : null}
      {edgeAxisOf(chart.data, format)}
      <YAxis
        {...VALUE_CHROME}
        allowDecimals={false}
        tickFormatter={chart.formatNumber()}
        width="auto"
      />
      <Tooltip
        content={<Chart.Tooltip headingOf={(entries) => rangeOf(entries, format)} />}
        {...omitUndefined({ defaultIndex })}
      />
      <Bar
        dataKey={COUNT}
        fill={chart.color(COUNT)}
        isAnimationActive={options.animate ? "auto" : false}
        shape={<BinShape place={0} shown={1} />}
      />
      {options.children}
    </BarChart>
  );
}

/**
 * Renders the chart's figure around the bars.
 *
 * @param props - The values, the bins, the words, the switches and the figure's props.
 */
export function HistogramChart({
  animate = false,
  bins,
  caption,
  children,
  color,
  countLabel = "Count",
  defaultIndex,
  domain,
  empty = EMPTY,
  grid = true,
  label,
  locale,
  valueOptions,
  values,
  ...root
}: HistogramChartProps): ReactElement {
  const chart = Chart.useChart({
    data: rowsOf(binValues(values, omitUndefined({ bins, domain }))),
    locale,
    series: [{ color, key: COUNT, label: countLabel }],
  });
  const plot = { animate, chart, children, defaultIndex, grid, label, valueOptions };

  return (
    <Chart.Root chart={chart} {...root}>
      <Chart.Plot>{plotOf(plot)}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
