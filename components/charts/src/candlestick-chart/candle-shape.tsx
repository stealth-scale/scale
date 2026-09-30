/**
 * Renders one candle of a candlestick chart: the wick from the period's low to its high, and the
 * body from its open to its close in front of it.
 *
 * @remarks
 *   Recharts hands the shape the bar of the period's whole range, and the shape places each price
 *   within that bar, so the candle grows with the bar's entrance. The candle takes its direction's
 *   color. A doji, a period that closed at its open, has a body 1.5px high, because a body of no
 *   height would read as a missing period. The candle under the pointer or the keyboard takes a
 *   wick and an edge 2px wide.
 */

import { type ReactElement } from "react";

import { type CandleRow } from "#candlestick-chart/candles.ts";
import { type BarBox, placementOf } from "#cartesian/placement.ts";

/**
 * Least height of a body in pixels, so a doji renders.
 */
const DOJI = 1.5;

/**
 * Describes the props of a candle: what recharts passes of the period's bar, and the switch.
 */
export interface CandleShapeProps extends BarBox {
  /**
   * Whether the candle is the one under the pointer or the keyboard. Recharts' `activeBar` passes
   * it.
   */
  readonly active?: boolean | undefined;

  /**
   * Row of the period. Recharts passes it.
   */
  readonly payload?: CandleRow | undefined;
}

/**
 * Renders the candle, or nothing without a row.
 *
 * @param props - The period's bar and row, and the switch.
 */
export function CandleShape({
  active = false,
  payload,
  ...bar
}: CandleShapeProps): null | ReactElement {
  if (payload === undefined) return null;

  const { candle, color } = payload;
  const { at, middle, width, x } = placementOf(payload.range, bar);
  const top = at(Math.max(candle.open, candle.close));
  const bottom = at(Math.min(candle.open, candle.close));

  return (
    <g>
      <line
        stroke={color}
        strokeWidth={active ? 2 : 1}
        x1={middle}
        x2={middle}
        y1={at(candle.high)}
        y2={at(candle.low)}
      />
      <rect
        fill={color}
        height={Math.max(bottom - top, DOJI)}
        stroke={color}
        strokeWidth={active ? 2 : 0}
        width={width}
        x={x}
        y={top}
      />
    </g>
  );
}
