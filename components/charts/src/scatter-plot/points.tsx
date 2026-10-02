/**
 * Renders a scatter's points: a recharts `Scatter` per series, in the series' color.
 *
 * @remarks
 *   A series' points hide while the legend hides the series and fade while the legend points at
 *   another. They animate in only when the caller asks, and then only outside reduced motion. With
 *   a label field, each point writes that field's words beside it, numbered after the points of
 *   the series before it, so the first of two close points keeps its words.
 */

import { type ReactElement } from "react";

import { LabelList, type LabelProps, Scatter } from "recharts";

import { type ChartApi } from "#chart/use-chart.ts";
import { type Owned } from "#scatter-plot/owners.ts";
import { PointLabel } from "#scatter-plot/point-label.tsx";

/**
 * Describes what a scatter's points are rendered from.
 */
export interface PointsOptions {
  /**
   * Whether the points animate in, which they do only outside reduced motion.
   */
  readonly animate: boolean;

  /**
   * Chart whose legend hides, fades and colors each series.
   */
  readonly chart: ChartApi;

  /**
   * Field of each point whose words are written beside it.
   */
  readonly labelKey?: string | undefined;

  /**
   * Series the chart plots, each with its points.
   */
  readonly series: readonly Owned[];
}

/**
 * Returns the writer of a series' labels, which places each label after the labels of the series
 * before it.
 *
 * @remarks
 *   Recharts passes every side of a point's box and the point's index as numbers, so each reads as
 *   it is.
 * @param offset - The number of points in the series before this one.
 */
function labelsOf(offset: number): (props: LabelProps) => ReactElement {
  /**
   * Returns a point's words from the box, the index and the value recharts passes its label.
   */
  return function label(props) {
    return (
      <PointLabel
        height={Number(props.height)}
        order={offset + Number(props.index)}
        value={props.value}
        width={Number(props.width)}
        x={Number(props.x)}
        y={Number(props.y)}
      />
    );
  };
}

/**
 * Returns a recharts `Scatter` per series, in the order of the series.
 *
 * @param options - The entrance switch, the chart, the label field and the series.
 */
export function pointsOf({ animate, chart, labelKey, series }: PointsOptions): ReactElement[] {
  return series.map((each, index) => {
    const offset = series
      .slice(0, index)
      .reduce((count, before) => count + before.points.length, 0);

    return (
      <Scatter
        data={each.points}
        fill={chart.color(each.key)}
        hide={chart.hidden(each.key)}
        isAnimationActive={animate ? "auto" : false}
        key={each.key}
        name={each.key}
        opacity={chart.opacity(each.key)}
      >
        {labelKey === undefined ? null : (
          <LabelList content={labelsOf(offset)} dataKey={labelKey} />
        )}
      </Scatter>
    );
  });
}
