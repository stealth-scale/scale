/**
 * Renders two or more distributions on one set of bins, each series' bar beside the others in
 * every bin.
 *
 * @remarks
 *   The bins come from every series' values together, because two histograms binned apart put their
 *   bars at different edges and widths and still look like a comparison. Series of different sizes
 *   compare through `normalize`, which counts each bin as a share of its own series' total and
 *   writes the value axis in percent. The bars of a bin are side by side, where overlaid bars mix
 *   into a color that belongs to neither series.
 */

import { type ReactElement, type ReactNode } from "react";

import { Bar, BarChart, CartesianGrid, Tooltip, YAxis } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { VALUE_CHROME } from "#cartesian/axes.tsx";
import { finiteOf } from "#cartesian/finite.ts";
import * as Chart from "#chart/index.ts";
import { edgeAxisOf, type EdgeRow, rangeOf } from "#histogram-chart/axis.tsx";
import { BinShape } from "#histogram-chart/bin-shape.tsx";
import { binValues, type ChartBin, inBin } from "#histogram-chart/bins.ts";

/**
 * Message the chart renders without values unless it states one.
 */
const EMPTY = "No data";

/**
 * `Intl.NumberFormat` options of a share: a percent with at most one decimal.
 */
const SHARE: Intl.NumberFormatOptions = { maximumFractionDigits: 1, style: "percent" };

/**
 * Describes a series of a distribution chart: the kit's series and its own values.
 */
export interface DistributionSeries extends Chart.SeriesOptions {
  /**
   * Values of the series, one per thing measured. A value that is not a finite number is left out.
   */
  readonly values: readonly unknown[];
}

/**
 * Describes one row of the chart: a bin and each series' count or share in it.
 */
interface DistributionRow extends EdgeRow {
  /**
   * Count of each series in the bin, or its share of the series' total, by the series' key.
   */
  readonly counts: Readonly<Record<string, number>>;
}

/**
 * Describes the props of a distribution chart: the series and their values, the bins, the words,
 * the switches and the figure's props.
 */
export interface DistributionChartProps
  extends
    Omit<Chart.ChartOptions<unknown>, "data" | "series">,
    Omit<Chart.RootProps, "chart" | "children" | "grid"> {
  /**
   * Whether the bars animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Number of bins to aim for, at most 30. Freedman–Diaconis' count of every value together unless
   * stated.
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
   * Index of the bin the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while no series has a value.
   */
  readonly empty?: ReactNode;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid?: boolean | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Delivery times by region".
   */
  readonly label: string;

  /**
   * Whether the legend renders below the plot. It renders while two or more series have values
   * unless stated.
   */
  readonly legend?: boolean | undefined;

  /**
   * Accessible name of the legend's group of buttons.
   */
  readonly legendLabel?: string | undefined;

  /**
   * Whether each bin reads as a share of its series' total, for series of different sizes. The
   * value axis and the tooltip then write percents.
   */
  readonly normalize?: boolean | undefined;

  /**
   * Series the chart compares, in the order the legend lists them and a bin places their bars.
   */
  readonly series: readonly DistributionSeries[];

  /**
   * `Intl.NumberFormat` options the bin edges are written with, on the axis and in the tooltip.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;
}

/**
 * Returns a row per bin, with each series' count in it or its share of the series' total.
 *
 * @param series - The series, each with its values.
 * @param bins - The bins chosen from every series' values together.
 * @param normalize - Whether each count reads as a share.
 */
function rowsOf(
  series: readonly DistributionSeries[],
  bins: readonly ChartBin[],
  normalize: boolean,
): DistributionRow[] {
  const columns = series.map((each) => ({
    key: each.key,
    numbers: each.values.flatMap((value) => finiteOf(value) ?? []),
  }));
  const last = bins.length - 1;

  return bins.map((bin, at) => {
    const counts: Record<string, number> = {};

    for (const { key, numbers } of columns) {
      const count = numbers.filter((value) => inBin(value, bin, at === last)).length;

      counts[key] = normalize ? count / Math.max(numbers.length, 1) : count;
    }

    return { counts, from: bin.from, middle: (bin.from + bin.to) / 2, to: bin.to };
  });
}

/**
 * Returns each series' options without its values, which the chart's state reads.
 */
function optionsOf(series: readonly DistributionSeries[]): Chart.SeriesOptions[] {
  return series.map(({ color, key, label }) => ({ color, key, label }));
}

/**
 * Describes what the recharts chart is built from.
 */
interface PlotOptions extends Pick<
  DistributionChartProps,
  "children" | "defaultIndex" | "label" | "valueOptions"
> {
  /**
   * Whether the bars animate in.
   */
  readonly animate: boolean;

  /**
   * Chart whose rows the bars render.
   */
  readonly chart: Chart.ChartApi<DistributionRow>;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid: boolean;

  /**
   * Whether each bin reads as a share of its series' total.
   */
  readonly normalize: boolean;
}

/**
 * Returns a bar per series, each rendered at its place among the series the legend shows.
 */
function barsOf({ animate, chart }: Pick<PlotOptions, "animate" | "chart">): ReactElement[] {
  const shown = chart.series.filter((each) => !each.hidden);

  return chart.series.map((each) => (
    <Bar
      dataKey={(row: DistributionRow) => row.counts[each.key]}
      fill={each.color}
      hide={each.hidden}
      isAnimationActive={animate ? "auto" : false}
      key={each.key}
      name={each.key}
      opacity={each.opacity}
      shape={<BinShape place={shown.indexOf(each)} shown={shown.length} />}
    />
  ));
}

/**
 * Returns recharts' bar chart of the bins: the grid, the edge axis, the value axis, the tooltip,
 * a bar per series in every bin, and the caller's children.
 *
 * @param options - The chart, the words and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { chart, defaultIndex, normalize } = options;
  const format = chart.formatNumber(options.valueOptions);
  const value = chart.formatNumber(normalize ? SHARE : undefined);

  return (
    <BarChart accessibilityLayer barCategoryGap={0} data={chart.data} title={options.label}>
      {options.grid ? <CartesianGrid vertical={false} /> : null}
      {edgeAxisOf(chart.data, format)}
      <YAxis {...VALUE_CHROME} allowDecimals={normalize} tickFormatter={value} width="auto" />
      <Tooltip
        content={
          <Chart.Tooltip formatValue={value} headingOf={(entries) => rangeOf(entries, format)} />
        }
        {...omitUndefined({ defaultIndex })}
      />
      {barsOf(options)}
      {options.children}
    </BarChart>
  );
}

/**
 * Renders the chart's figure around the bars, the legend and the caption.
 *
 * @param props - The series, the bins, the words, the switches and the figure's props.
 */
export function DistributionChart({
  animate = false,
  bins,
  caption,
  children,
  defaultHiddenKeys,
  defaultIndex,
  empty = EMPTY,
  grid = true,
  hiddenKeys,
  label,
  legend,
  legendLabel,
  locale,
  normalize = false,
  onHiddenKeysChange,
  series,
  valueOptions,
  ...root
}: DistributionChartProps): ReactElement {
  const pooled = series.flatMap((each) => [...each.values]);
  const chart = Chart.useChart({
    data: rowsOf(series, binValues(pooled, omitUndefined({ bins })), normalize),
    defaultHiddenKeys,
    hiddenKeys,
    locale,
    onHiddenKeysChange,
    series: optionsOf(series),
  });
  const legended = (legend ?? series.length > 1) && chart.data.length > 0;
  const plot = { animate, chart, children, defaultIndex, grid, label, normalize, valueOptions };

  return (
    <Chart.Root chart={chart} {...root}>
      <Chart.Plot>{plotOf(plot)}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legended ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
