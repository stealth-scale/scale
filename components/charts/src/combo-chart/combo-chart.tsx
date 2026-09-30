/**
 * Renders a combo chart: bars, lines and areas on one plot, each series in the mark it states, and
 * a second value axis at the end edge while a series reads it.
 *
 * @remarks
 *   A combo chart is for series whose marks mean different things, such as amounts as bars and a
 *   rate as a line. Recharts renders areas behind bars and bars behind lines whatever the series'
 *   order. Where two axes cross is an artefact of their two domains, so the end axis is opt-in,
 *   per series, for a series in another unit, and the caption states what each axis measures.
 */

import { type ReactElement } from "react";

import { type YAxisProps } from "recharts";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type ComboSeries, type Curve } from "#cartesian/types.ts";

/**
 * Describes the props of a combo chart: the cartesian props, series that state their marks and
 * axes, the end axis and the path of a line.
 *
 * @typeParam Row - One row of the data.
 */
export interface ComboChartProps<Row> extends Omit<CartesianProps<Row>, "series"> {
  /**
   * Path of each line and area's edge between two points. Smoothed through them unless stated.
   */
  readonly curve?: Curve | undefined;

  /**
   * Domain of the end axis in recharts' terms, such as `[0, 1]`. From zero unless stated.
   */
  readonly endDomain?: YAxisProps["domain"];

  /**
   * `Intl.NumberFormat` options the end axis' ticks and its series' values are written with.
   */
  readonly endOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Series the chart plots, each with its mark and value axis, in the order the legend lists them.
   */
  readonly series: readonly ComboSeries[];
}

/**
 * Renders the chart's figure around a mark per series, each in the mark it states.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series, the words, the end axis and the curve.
 */
export function ComboChart<Row>({
  curve = "monotone",
  ...props
}: ComboChartProps<Row>): ReactElement {
  return (
    <Cartesian {...props} shape={{ curve, direction: "vertical", mark: "mixed", stack: "none" }} />
  );
}
