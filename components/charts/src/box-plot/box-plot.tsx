/**
 * Renders a box plot: each group's distribution as its median, its middle half, its whiskers and
 * its outliers, side by side along a category axis.
 *
 * @remarks
 *   A box plot compares where values fall, so the value axis is rounded around the values and
 *   starts at zero only where `valueDomain` states it. Each group's bar spans its smallest value to
 *   its largest, which keeps every outlier inside the plot, and `BoxShape` renders the box in that
 *   bar. A box plot is read by convention, so a key under the plot names each part unless `legend`
 *   is false. The tooltip heads each group with its name and writes its median, middle half,
 *   whiskers, outliers and count. A group that states a `summary` is rendered from it, whatever
 *   its `values`.
 */

import { type ReactElement, type ReactNode } from "react";

import { type YAxisProps } from "recharts";

import { BoxKey } from "#box-plot/box-key.tsx";
import { type BoxRow, BoxShape } from "#box-plot/box-shape.tsx";
import { type BoxWords, factsOf } from "#box-plot/words.ts";
import { RANGE, rangedPlotOf } from "#cartesian/ranged.tsx";
import * as Chart from "#chart/index.ts";
import { boxStats, type BoxSummary } from "#stats/box.ts";

/**
 * Message the chart renders without a group to render unless it states one.
 */
const EMPTY = "No data";

/**
 * Widest a box renders in pixels, however wide its band.
 */
const WIDEST = 72;

/**
 * Describes a group of a box plot: its key, its name, and its values or a summary of them.
 */
export interface BoxGroup {
  /**
   * Key of the group.
   */
  readonly key: string;

  /**
   * Name of the group, which the category axis and the tooltip write.
   */
  readonly label: string;

  /**
   * Summary to render, for values summarised elsewhere, such as in a query. The chart renders it
   * in place of `values`.
   */
  readonly summary?: BoxSummary | undefined;

  /**
   * Values of the group, one per thing measured. A value that is not a finite number is left out.
   */
  readonly values?: readonly unknown[] | undefined;
}

/**
 * Describes the props of a box plot: the groups, the words, the switches and the figure's props.
 */
export interface BoxPlotProps extends Omit<
  Chart.RootProps,
  "chart" | "children" | "color" | "grid"
> {
  /**
   * Whether the boxes grow in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the boxes, such as a `ReferenceLine`.
   */
  readonly children?: ReactNode;

  /**
   * Palette the boxes take their color from. The theme's first series color unless stated.
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
  readonly groups: readonly BoxGroup[];

  /**
   * Accessible name of the chart's keyboard layer, such as "Response times by region".
   */
  readonly label: string;

  /**
   * Whether the key naming the box's parts renders below the plot.
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
   * Whether each outlier renders as a point.
   */
  readonly outliers?: boolean | undefined;

  /**
   * Name of the outliers in the tooltip and the key.
   */
  readonly outliersLabel?: ReactNode;

  /**
   * Name of the box, the first quartile to the third, in the tooltip and the key.
   */
  readonly quartilesLabel?: ReactNode;

  /**
   * Domain of the value axis in recharts' terms, such as `[0, 500]`. Rounded around the values
   * unless stated.
   */
  readonly valueDomain?: YAxisProps["domain"];

  /**
   * `Intl.NumberFormat` options the value ticks and the tooltip's values are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Reach of a whisker past the box in interquartile ranges. Tukey's 1.5 unless stated.
   */
  readonly whisker?: number | undefined;

  /**
   * Name of the whiskers' reach in the tooltip and the key.
   */
  readonly whiskersLabel?: ReactNode;
}

/**
 * Returns a row per group with a summary: the group's own, else the summary of its values. A
 * group without a finite value has no row.
 *
 * @param groups - The groups, each with values or a summary.
 * @param whisker - The whisker's reach in interquartile ranges.
 */
function rowsOf(groups: readonly BoxGroup[], whisker: number | undefined): BoxRow[] {
  return groups.flatMap(({ key, label, summary, values = [] }): BoxRow[] => {
    const summarised = summary ?? boxStats(values, whisker);

    return summarised === undefined
      ? []
      : [{ key, label, range: [summarised.min, summarised.max], summary: summarised }];
  });
}

/**
 * Describes the props that name a box plot's numbers.
 */
type LabelProps = Pick<
  BoxPlotProps,
  "countLabel" | "medianLabel" | "outliersLabel" | "quartilesLabel" | "whiskersLabel"
>;

/**
 * Returns the names of a box plot's numbers from its label props, in English unless stated.
 */
function wordsOf({
  countLabel = "Count",
  medianLabel = "Median",
  outliersLabel = "Outliers",
  quartilesLabel = "Middle half",
  whiskersLabel = "Whiskers",
}: LabelProps): BoxWords {
  return {
    count: countLabel,
    median: medianLabel,
    outliers: outliersLabel,
    quartiles: quartilesLabel,
    whiskers: whiskersLabel,
  };
}

/**
 * Renders the chart's figure around the boxes, the key and the caption.
 *
 * @param props - The groups, the words, the switches and the figure's props.
 */
export function BoxPlot({
  animate = false,
  caption,
  children,
  color,
  countLabel,
  defaultIndex,
  empty = EMPTY,
  grid = true,
  groups,
  label,
  legend = true,
  locale,
  medianLabel,
  outliers = true,
  outliersLabel,
  quartilesLabel,
  valueDomain,
  valueOptions,
  whisker,
  whiskersLabel,
  ...root
}: BoxPlotProps): ReactElement {
  const chart = Chart.useChart({
    data: rowsOf(groups, whisker),
    locale,
    series: [{ color, key: RANGE }],
  });
  const words = wordsOf({ countLabel, medianLabel, outliersLabel, quartilesLabel, whiskersLabel });
  const formatValue = chart.formatNumber(valueOptions);
  const facts = factsOf(words, { count: chart.formatNumber(), value: formatValue });
  const plot = { animate, categoryKey: "label", chart, children, defaultIndex, facts, formatValue };

  return (
    <Chart.Root chart={chart} {...root}>
      <Chart.Plot>
        {rangedPlotOf({
          ...plot,
          activeShape: <BoxShape active outliers={outliers} />,
          grid,
          label,
          shape: <BoxShape outliers={outliers} />,
          valueDomain,
          widest: WIDEST,
        })}
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && chart.data.length > 0 ? (
        <BoxKey color={chart.color(RANGE)} outliers={outliers} words={words} />
      ) : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
