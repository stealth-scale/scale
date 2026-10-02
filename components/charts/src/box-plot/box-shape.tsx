/**
 * Renders one box of a box plot: the whiskers with their caps, the box from the first quartile to
 * the third, the median, and each outlier as a hollow point.
 *
 * @remarks
 *   Recharts hands the shape the bar of the group's whole range, from its smallest value to its
 *   largest, with the group's row. The shape places each number of the summary within that bar, so
 *   the box grows with the bar's entrance and reads no scale of its own. The box fills at 0.35 of
 *   its color with an edge in the color, the median crosses it in the ink, and the whiskers are in
 *   the muted ink, so the median reads first. The box under the pointer or the keyboard fills at
 *   0.6 with an edge 2px wide.
 */

import { type ReactElement } from "react";

import { type BarBox, type Placement, placementOf } from "#cartesian/placement.ts";
import { MEDIAN, OUTLIER, WHISKER } from "#chart/recipe.ts";
import { type BoxSummary } from "#stats/box.ts";

/**
 * Width of a whisker's cap as a share of the box, at least 4px.
 */
const CAP = 0.4;

/**
 * Radius of an outlier's point in pixels.
 */
const POINT = 2.5;

/**
 * Describes a row of a box plot: a group's name, the range of its values and its summary.
 */
export interface BoxRow {
  /**
   * Key of the group.
   */
  readonly key: string;

  /**
   * Name of the group, which the category axis writes.
   */
  readonly label: string;

  /**
   * Smallest and largest value, which the group's bar spans.
   */
  readonly range: readonly [number, number];

  /**
   * Summary the box renders.
   */
  readonly summary: BoxSummary;
}

/**
 * Describes the props of a box: what recharts passes of the group's bar, and the switches.
 */
export interface BoxShapeProps extends BarBox {
  /**
   * Whether the box is the one under the pointer or the keyboard. Recharts' `activeBar` passes it.
   */
  readonly active?: boolean | undefined;

  /**
   * CSS value of the box's color. Recharts passes the bar's `fill`.
   */
  readonly fill?: string | undefined;

  /**
   * Whether each outlier renders as a point.
   */
  readonly outliers?: boolean | undefined;

  /**
   * Row of the group. Recharts passes it.
   */
  readonly payload?: BoxRow | undefined;
}

/**
 * Returns the whiskers: a stem from each whisker's end to the box, and a cap across each end.
 *
 * @param summary - The summary the box renders.
 * @param placement - Where values go within the group's bar.
 */
function whiskersOf(summary: BoxSummary, { at, middle, width }: Placement): ReactElement {
  const cap = Math.max(width * CAP, 4);
  const high = at(summary.whiskerHigh);
  const low = at(summary.whiskerLow);

  return (
    <>
      <line className={WHISKER} x1={middle} x2={middle} y1={high} y2={at(summary.q3)} />
      <line className={WHISKER} x1={middle} x2={middle} y1={at(summary.q1)} y2={low} />
      <line className={WHISKER} x1={middle - cap / 2} x2={middle + cap / 2} y1={high} y2={high} />
      <line className={WHISKER} x1={middle - cap / 2} x2={middle + cap / 2} y1={low} y2={low} />
    </>
  );
}

/**
 * Returns a hollow point in the box's color per outlier value. Outliers of equal value share one
 * point, which they would cover anyway.
 */
function pointsOf(summary: BoxSummary, { at, middle }: Placement, fill: string): ReactElement[] {
  return [...new Set(summary.outliers)].map((value) => (
    <circle
      className={OUTLIER}
      cx={middle}
      cy={at(value)}
      key={value}
      r={POINT}
      stroke={fill}
      strokeWidth={1.5}
    />
  ));
}

/**
 * Renders the box, or nothing without a row.
 *
 * @param props - The group's bar and row, and the switches.
 */
export function BoxShape({
  active = false,
  fill = "currentColor",
  outliers = true,
  payload,
  ...bar
}: BoxShapeProps): null | ReactElement {
  const summary = payload?.summary;

  if (summary === undefined) return null;

  const placement = placementOf([summary.min, summary.max], bar);
  const top = placement.at(summary.q3);
  const median = placement.at(summary.median);

  return (
    <g>
      {whiskersOf(summary, placement)}
      <rect
        fill={fill}
        fillOpacity={active ? 0.6 : 0.35}
        height={Math.max(placement.at(summary.q1) - top, 1)}
        stroke={fill}
        strokeWidth={active ? 2 : 1}
        width={placement.width}
        x={placement.x}
        y={top}
      />
      <line
        className={MEDIAN}
        strokeWidth={2}
        x1={placement.x}
        x2={placement.x + placement.width}
        y1={median}
        y2={median}
      />
      {outliers ? pointsOf(summary, placement, fill) : null}
    </g>
  );
}
