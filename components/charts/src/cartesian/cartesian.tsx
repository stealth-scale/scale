/**
 * Renders a cartesian preset: the chart's figure, plot, empty state, legend and caption around
 * recharts' line, area, bar or composed chart, with a mark per declared series.
 *
 * @remarks
 *   Every preset renders this core with the shape it fixes. The legend renders while two or more
 *   series have rows to switch, unless `legend` states otherwise, and the empty state renders in
 *   the plot's place while the chart has no rows. An end axis renders while a series reads it. A
 *   series that is the earlier period of another takes the neutral palette unless it states a
 *   color.
 */

import { type ReactElement, useId } from "react";

import { BulletKey } from "#cartesian/bullet-key.tsx";
import { seriesOptionsOf } from "#cartesian/periods.ts";
import { plotOf, type PlotProps } from "#cartesian/plot.tsx";
import { type CartesianCoreProps } from "#cartesian/types.ts";
import * as Chart from "#chart/index.ts";

/**
 * Message the chart renders without rows unless the preset states one.
 */
const EMPTY = "No data";

/**
 * Splits a core's props into the props the plot is built from and the rest, which the chart's
 * state and the figure read.
 *
 * @typeParam Row - One row of the data.
 * @param props - A preset's props, its series, its shape and its end axis.
 */
function split<Row>(
  props: CartesianCoreProps<Row>,
): [PlotProps<Row>, Omit<CartesianCoreProps<Row>, keyof PlotProps<Row>>] {
  const {
    animate,
    annotations,
    categoryKey,
    children,
    defaultIndex,
    endDomain,
    endOptions,
    grid,
    label,
    labelOptions,
    series,
    shape,
    stackOrder,
    targetLabel,
    valueDomain,
    valueOptions,
    zones,
    ...rest
  } = props;
  const plot = { animate, annotations, categoryKey, children, defaultIndex, endDomain, endOptions };
  const words = { grid, label, labelOptions, targetLabel, valueOptions };

  return [{ ...plot, ...words, series, shape, stackOrder, valueDomain, zones }, rest];
}

/**
 * Returns a bullet graph's key, while a series reads targets or a zone has a name, else nothing.
 *
 * @param plot - The props the plot is built from: the series, the target's name and the zones.
 */
function keyOf<Row>({ series, targetLabel, zones = [] }: PlotProps<Row>): null | ReactElement {
  const targeted = series.some((each) => each.target !== undefined);

  return targeted || zones.some((zone) => zone.label !== undefined) ? (
    <BulletKey targeted={targeted} targetLabel={targetLabel} zones={zones} />
  ) : null;
}

/**
 * Renders the figure around the preset's recharts chart, its legend and its caption.
 *
 * @typeParam Row - One row of the data.
 * @param props - A preset's props, its series, its shape and its end axis.
 */
export function Cartesian<Row>(props: CartesianCoreProps<Row>): ReactElement {
  const [plot, rest] = split(props);
  const { caption, data, defaultHiddenKeys, empty = EMPTY, hiddenKeys, legend, ...others } = rest;
  const { legendLabel, locale, onHiddenKeysChange, ...root } = others;
  const { series } = plot;
  const chart = Chart.useChart({
    data,
    defaultHiddenKeys,
    hiddenKeys,
    locale,
    onHiddenKeysChange,
    series: seriesOptionsOf(series),
  });
  const gradient = useId();
  const legended = (legend ?? series.length > 1) && chart.data.length > 0;

  return (
    <Chart.Root chart={chart} {...root}>
      <Chart.Plot>{plotOf(chart, gradient, plot)}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {chart.data.length > 0 ? keyOf(plot) : null}
      {legended ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
