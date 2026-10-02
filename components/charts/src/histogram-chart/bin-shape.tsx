/**
 * Renders one series' bar in a bin, at the pixels the x axis' scale gives the bin's edges.
 *
 * @remarks
 *   Recharts places a bar on a numeric axis at its data point, rounds its width to a whole pixel,
 *   and puts a second series' bar a whole bin late, so the shape reads the bin's two edges through
 *   `useXAxisScale` and takes its series' share of the bin's width. The bars of a bin are side by
 *   side in the order of the series shown, and the bins touch.
 */

import { type ReactElement } from "react";

import { Rectangle, type RectangleProps, useXAxisScale } from "recharts";

import { finiteAt } from "#cartesian/finite.ts";

/**
 * Describes the props of a bin's bar: recharts' rectangle, the row it was read from, and its
 * series' place among the series shown.
 */
export interface BinShapeProps extends RectangleProps {
  /**
   * Row of the bin, with its `from` and `to` edges. Recharts passes it.
   */
  readonly payload?: unknown;

  /**
   * Place of the bar's series among the series shown, from 0.
   */
  readonly place: number;

  /**
   * Number of series shown, which share the bin's width.
   */
  readonly shown: number;
}

/**
 * Renders the bar from its share of the bin's width, or nothing outside a chart's x axis.
 *
 * @param props - The rectangle, the row and the series' place.
 */
export function BinShape({
  payload,
  place,
  shown,
  ...rectangle
}: BinShapeProps): null | ReactElement {
  const scale = useXAxisScale();
  const left = scale?.(finiteAt(payload, "from"));
  const right = scale?.(finiteAt(payload, "to"));

  if (left === undefined || right === undefined) return null;

  const width = (right - left) / shown;

  return <Rectangle {...rectangle} width={width} x={left + place * width} />;
}
