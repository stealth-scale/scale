/**
 * Renders a violin plot: each group's distribution as the density of its values, mirrored about the
 * middle of its band, with its quartiles inside.
 *
 * @remarks
 *   Two groups with the same five numbers can have one peak or two, which a box plot renders
 *   alike. The violin renders the density, and the tooltip lists the values it peaks at. The chart
 *   takes the values themselves, because no summary gives a density back. Silverman's bandwidth
 *   smooths each group unless `bandwidth` states one kernel for every group, which compares the
 *   shapes on equal terms. Each violin is as wide as its bar at its own densest value, so its width
 *   compares within the group only, and the key under the plot names the parts.
 */

import { type ReactElement, type ReactNode } from "react";

import { type YAxisProps } from "recharts";

import { RANGE, rangedPlotOf } from "#cartesian/ranged.tsx";
import * as Chart from "#chart/index.ts";
import { boxStats } from "#stats/box.ts";
import { type DensityOptions, densityPeaks, kernelDensity } from "#stats/density.ts";
import { ViolinKey } from "#violin-plot/violin-key.tsx";
import { type ViolinRow, ViolinShape } from "#violin-plot/violin-shape.tsx";
import { factsOf, type ViolinWords } from "#violin-plot/words.ts";

/**
 * Message the chart renders without a group to render unless it states one.
 */
const EMPTY = "No data";

/**
 * Widest a violin renders in pixels, however wide its band.
 */
const WIDEST = 110;

/**
 * Describes a group of a violin plot: its key, its name and its values.
 */
export interface ViolinGroup {
  /**
   * Key of the group.
   */
  readonly key: string;

  /**
   * Name of the group, which the category axis and the tooltip write.
   */
  readonly label: string;

  /**
   * Values of the group, one per thing measured. A value that is not a finite number is left out.
   */
  readonly values: readonly unknown[];
}

/**
 * Describes the props of a violin plot: the groups, the kernel, the words, the switches and the
 * figure's props.
 */
export interface ViolinPlotProps extends Omit<
  Chart.RootProps,
  "chart" | "children" | "color" | "grid"
> {
  /**
   * Whether the violins grow in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Standard deviation of the Gaussian kernel for every group, in the values' own units.
   * Silverman's bandwidth of each group unless stated.
   */
  readonly bandwidth?: number | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the violins, such as a `ReferenceLine`.
   */
  readonly children?: ReactNode;

  /**
   * Palette the violins take their color from. The theme's first series color unless stated.
   */
  readonly color?: Chart.ChartColor | undefined;

  /**
   * Name of the number of values in the tooltip.
   */
  readonly countLabel?: ReactNode;

  /**
   * Index of the group the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Name of the outline in the key.
   */
  readonly densityLabel?: ReactNode;

  /**
   * Message the chart renders in the plot's place while no group has a value.
   */
  readonly empty?: ReactNode;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid?: boolean | undefined;

  /**
   * Groups the chart compares, in the order the category axis lists them.
   */
  readonly groups: readonly ViolinGroup[];

  /**
   * Accessible name of the chart's keyboard layer, such as "Response times by cache".
   */
  readonly label: string;

  /**
   * Whether the key naming the violin's parts renders below the plot.
   */
  readonly legend?: boolean | undefined;

  /**
   * Locale the values are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Name of the median in the tooltip and the key.
   */
  readonly medianLabel?: ReactNode;

  /**
   * Name of the values the density peaks at in the tooltip.
   */
  readonly peaksLabel?: ReactNode;

  /**
   * Whether the whisker line, the quartile bar and the median point render inside each violin.
   */
  readonly quartiles?: boolean | undefined;

  /**
   * Name of the first quartile to the third in the tooltip and the key.
   */
  readonly quartilesLabel?: ReactNode;

  /**
   * Name of the smallest value to the largest in the tooltip.
   */
  readonly rangeLabel?: ReactNode;

  /**
   * Number of points each density is sampled at, at least 2. 64 unless stated.
   */
  readonly resolution?: number | undefined;

  /**
   * Domain of the value axis in recharts' terms, such as `[0, 500]`. Rounded around the values
   * unless stated.
   */
  readonly valueDomain?: YAxisProps["domain"];

  /**
   * `Intl.NumberFormat` options the value ticks and the tooltip's values are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;
}

/**
 * Returns a row per group with a finite value: its density, its peaks, its summary and its range.
 *
 * @param groups - The groups, each with its values.
 * @param options - The kernel's bandwidth and the number of points.
 */
function rowsOf(groups: readonly ViolinGroup[], options: DensityOptions): ViolinRow[] {
  return groups.flatMap(({ key, label, values }): ViolinRow[] => {
    const summary = boxStats(values);

    if (summary === undefined) return [];

    const density = kernelDensity(values, options);
    const widest = density.reduce((most, point) => Math.max(most, point.density), 0);

    return [
      {
        density,
        key,
        label,
        peaks: densityPeaks(density),
        range: [summary.min, summary.max],
        summary,
        widest,
      },
    ];
  });
}

/**
 * Describes the props that name a violin plot's numbers and parts.
 */
type LabelProps = Pick<
  ViolinPlotProps,
  "countLabel" | "densityLabel" | "medianLabel" | "peaksLabel" | "quartilesLabel" | "rangeLabel"
>;

/**
 * Returns the names of a violin plot's numbers and parts from its label props, in English unless
 * stated.
 */
function wordsOf({
  countLabel = "Count",
  densityLabel = "Density",
  medianLabel = "Median",
  peaksLabel = "Peaks",
  quartilesLabel = "Middle half",
  rangeLabel = "Range",
}: LabelProps): ViolinWords {
  return {
    count: countLabel,
    density: densityLabel,
    median: medianLabel,
    peaks: peaksLabel,
    quartiles: quartilesLabel,
    range: rangeLabel,
  };
}

/**
 * Renders the chart's figure around the violins, the key and the caption.
 *
 * @param props - The groups, the kernel, the words, the switches and the figure's props.
 */
export function ViolinPlot({
  animate = false,
  bandwidth,
  caption,
  children,
  color,
  countLabel,
  defaultIndex,
  densityLabel,
  empty = EMPTY,
  grid = true,
  groups,
  label,
  legend = true,
  locale,
  medianLabel,
  peaksLabel,
  quartiles = true,
  quartilesLabel,
  rangeLabel,
  resolution,
  valueDomain,
  valueOptions,
  ...root
}: ViolinPlotProps): ReactElement {
  const chart = Chart.useChart({
    data: rowsOf(groups, { bandwidth, resolution }),
    locale,
    series: [{ color, key: RANGE }],
  });
  const labels = { countLabel, densityLabel, medianLabel, peaksLabel, quartilesLabel, rangeLabel };
  const words = wordsOf(labels);
  const formatValue = chart.formatNumber(valueOptions);
  const facts = factsOf(words, { count: chart.formatNumber(), value: formatValue });
  const plot = { animate, categoryKey: "label", chart, children, defaultIndex, facts, formatValue };

  return (
    <Chart.Root chart={chart} {...root}>
      <Chart.Plot>
        {rangedPlotOf({
          ...plot,
          activeShape: <ViolinShape active quartiles={quartiles} />,
          grid,
          label,
          shape: <ViolinShape quartiles={quartiles} />,
          valueDomain,
          widest: WIDEST,
        })}
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && chart.data.length > 0 ? (
        <ViolinKey color={chart.color(RANGE)} quartiles={quartiles} words={words} />
      ) : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
