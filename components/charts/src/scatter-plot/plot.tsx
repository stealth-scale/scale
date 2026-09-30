/**
 * Renders a scatter's recharts chart: the grid, the axes, the quadrants, the tooltip, a symbol per
 * point in each series' color, and the caller's children.
 *
 * @remarks
 *   The quadrants' lines and names render before the points, so the points paint over them. A
 *   quadrant chart divides at the values its quadrants state, else at the middle of each axis'
 *   span.
 */

import { type ReactElement } from "react";

import { ScatterChart } from "recharts";

import { type ChartApi } from "#chart/use-chart.ts";
import { scatterAxesOf, scatterGridOf } from "#scatter-plot/axes.tsx";
import { pointsOf } from "#scatter-plot/points.tsx";
import { QuadrantLayer } from "#scatter-plot/quadrant-layer.tsx";
import { divisionOf } from "#scatter-plot/quadrants.ts";
import { spanOf } from "#scatter-plot/span.ts";
import { type Field, tooltipOf } from "#scatter-plot/tooltip.tsx";
import { type ScatterFigure, type ScatterPlotProps } from "#scatter-plot/types.ts";

/**
 * Area of a point in square pixels unless stated, a radius of about 4.4px.
 */
const AREA = 60;

/**
 * Smallest and largest area of a sized point in square pixels, radii of 3.6 to 22.6px.
 */
const RANGE: readonly [number, number] = [40, 1600];

/**
 * Returns recharts' scatter chart: the grid, the axes, the quadrants, the tooltip, the points and
 * the caller's children.
 *
 * @typeParam Point - One point of a series.
 * @param chart - The chart the plot renders.
 * @param props - The scatter's own props.
 */
export function plotOf<Point extends object>(
  chart: ChartApi,
  props: Omit<ScatterPlotProps<Point>, keyof ScatterFigure>,
): ReactElement {
  const { animate = false, grid = true, labelKey, quadrants, series, sizeKey, xKey, yKey } = props;
  const x = { ends: props.xEnds, format: chart.formatNumber(props.xOptions), title: props.xLabel };
  const y = { ends: props.yEnds, format: chart.formatNumber(props.yOptions), title: props.yLabel };
  const size = { format: chart.formatNumber(props.sizeOptions), title: props.sizeLabel ?? "" };
  const axes = {
    x: { ...x, domain: props.xDomain, key: xKey },
    y: { ...y, domain: props.yDomain, key: yKey },
  };
  const points = series.flatMap((each) => [...each.points]);
  const layer =
    quadrants === undefined
      ? undefined
      : {
          division: divisionOf(quadrants, spanOf(axes.x, points), spanOf(axes.y, points)),
          names: quadrants.names,
        };

  /**
   * Returns the field an entry's value reads: the x axis', the y axis' or the size's.
   */
  const fieldOf = (key: unknown): Field => (key === xKey ? x : key === yKey ? y : size);

  return (
    <ScatterChart accessibilityLayer title={props.label}>
      {grid ? scatterGridOf(x, y) : null}
      {scatterAxesOf({
        area: props.size ?? AREA,
        size:
          sizeKey === undefined
            ? undefined
            : { key: sizeKey, range: props.sizeRange ?? RANGE, title: size.title },
        ...axes,
      })}
      {layer === undefined ? null : <QuadrantLayer {...layer} />}
      {tooltipOf({
        chart,
        defaultIndex: props.defaultIndex,
        fieldOf,
        heading: { labelKey, quadrants: layer, xKey, yKey },
        series,
      })}
      {pointsOf({ animate, chart, labelKey, series })}
      {props.children}
    </ScatterChart>
  );
}
