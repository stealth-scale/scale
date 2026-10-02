/**
 * Renders a scatter plot: a point per thing at two measures, and a series per group of things.
 *
 * @remarks
 *   A scatter's series share no category, so each series takes its own points. Neither axis
 *   explains itself, so both take a title, and the tooltip names each value by its axis' title
 *   under a heading that names the point's series. A scatter shows association, not cause, and past
 *   a few hundred points the middle of a cloud hides its density. Recharts' keyboard layer moves
 *   the tooltip through the first series' points only, so the series a reader walks goes first.
 *   With quadrants the plot places things by two scores into four named boxes, and the tooltip
 *   writes each point's quadrant after its name.
 */

import { type ReactElement } from "react";

import * as Chart from "#chart/index.ts";
import { type SeriesOptions } from "#chart/use-chart.ts";
import { plotOf } from "#scatter-plot/plot.tsx";
import {
  type ScatterFigure,
  type ScatterPlotProps,
  type ScatterSeries,
} from "#scatter-plot/types.ts";

/**
 * Message the chart renders without points unless it states one.
 */
const EMPTY = "No data";

/**
 * Returns each series' options without its points, which the chart's state reads.
 */
function optionsOf<Point>(series: ReadonlyArray<ScatterSeries<Point>>): SeriesOptions[] {
  const options: SeriesOptions[] = [];

  for (const each of series) options.push({ color: each.color, key: each.key, label: each.label });

  return options;
}

/**
 * Splits a scatter's props into its own props and the figure's props.
 *
 * @typeParam Point - One point of a series.
 * @param props - A scatter's props.
 */
function split<Point>(
  props: ScatterPlotProps<Point>,
): [Omit<ScatterPlotProps<Point>, keyof ScatterFigure>, ScatterFigure] {
  const {
    animate,
    caption,
    children,
    defaultHiddenKeys,
    defaultIndex,
    empty,
    grid,
    hiddenKeys,
    label,
    labelKey,
    legend,
    legendLabel,
    locale,
    onHiddenKeysChange,
    quadrants,
    series,
    size,
    sizeKey,
    sizeLabel,
    sizeOptions,
    sizeRange,
    xDomain,
    xEnds,
    xKey,
    xLabel,
    xOptions,
    yDomain,
    yEnds,
    yKey,
    yLabel,
    yOptions,
    ...figure
  } = props;
  const shown = { animate, caption, children, defaultHiddenKeys, defaultIndex, empty, grid };
  const keyed = { hiddenKeys, label, labelKey, legend, legendLabel, locale, onHiddenKeysChange };
  const sized = { size, sizeKey, sizeLabel, sizeOptions, sizeRange };
  const x = { xDomain, xEnds, xKey, xLabel, xOptions };
  const y = { yDomain, yEnds, yKey, yLabel, yOptions };

  return [{ ...shown, ...keyed, ...sized, ...x, ...y, quadrants, series }, figure];
}

/**
 * Renders the chart's figure around the points, the legend and the caption.
 *
 * @typeParam Point - One point of a series.
 * @param props - The series, the axes, the size of a point, the quadrants, the words and the
 *   figure's props.
 */
export function ScatterPlot<Point extends object>(props: ScatterPlotProps<Point>): ReactElement {
  const [own, figure] = split(props);
  const { caption, defaultHiddenKeys, empty = EMPTY, hiddenKeys, legend, legendLabel } = own;
  const { locale, onHiddenKeysChange, series } = own;
  const chart = Chart.useChart({
    data: series.flatMap((each) => [...each.points]),
    defaultHiddenKeys,
    hiddenKeys,
    locale,
    onHiddenKeysChange,
    series: optionsOf(series),
  });
  const legended = (legend ?? series.length > 1) && chart.data.length > 0;

  return (
    <Chart.Root chart={chart} {...figure}>
      <Chart.Plot>{plotOf(chart, own)}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legended ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
