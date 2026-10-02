/**
 * Renders one violin of a violin plot: the group's density mirrored about the middle of its band,
 * and inside it a whisker line, a narrow quartile bar and a hollow median point.
 *
 * @remarks
 *   Recharts hands the shape the bar of the group's whole range, and the shape places each value
 *   within that bar, so the violin grows with the bar's entrance. Each violin is as wide as its bar
 *   at its own densest value, so its width compares within the group, never across groups. The
 *   outline fills at 0.28 of its color with an edge in the color, and at 0.5 with an edge 2px wide
 *   under the pointer or the keyboard. The marker inside is narrow, because a box wide enough to
 *   read would cover the shape the chart exists to show.
 */

import { type ReactElement } from "react";

import { type BarBox, type Placement, placementOf } from "#cartesian/placement.ts";
import { MEDIAN, QUARTILES, WHISKER } from "#chart/recipe.ts";
import { type BoxSummary } from "#stats/box.ts";
import { type DensityPoint } from "#stats/density.ts";

/**
 * Width of the quartile bar as a share of the violin's, at least 3px.
 */
const BAR = 0.055;

/**
 * Radius of the median point as a share of the quartile bar's width, at least 2.5px.
 */
const POINT = 0.55;

/**
 * Describes a row of a violin plot: a group's name, its range, its summary and its density.
 */
export interface ViolinRow {
  /**
   * Density of the group's values, from its smallest value to its largest.
   */
  readonly density: readonly DensityPoint[];

  /**
   * Key of the group.
   */
  readonly key: string;

  /**
   * Name of the group, which the category axis writes.
   */
  readonly label: string;

  /**
   * Values the density peaks at.
   */
  readonly peaks: readonly number[];

  /**
   * Smallest and largest value, which the group's bar spans.
   */
  readonly range: readonly [number, number];

  /**
   * Summary the marker renders.
   */
  readonly summary: BoxSummary;

  /**
   * Largest density, where the violin is as wide as its bar.
   */
  readonly widest: number;
}

/**
 * Describes the props of a violin: what recharts passes of the group's bar, and the switches.
 */
export interface ViolinShapeProps extends BarBox {
  /**
   * Whether the violin is the one under the pointer or the keyboard. Recharts' `activeBar` passes
   * it.
   */
  readonly active?: boolean | undefined;

  /**
   * CSS value of the violin's color. Recharts passes the bar's `fill`.
   */
  readonly fill?: string | undefined;

  /**
   * Row of the group. Recharts passes it.
   */
  readonly payload?: undefined | ViolinRow;

  /**
   * Whether the whisker line, the quartile bar and the median point render inside the violin.
   */
  readonly quartiles?: boolean | undefined;
}

/**
 * Returns the outline's points: down the density on the end side of the middle, and back up on the
 * start side.
 *
 * @param row - The group's row.
 * @param placement - Where values go within the group's bar.
 */
function outlineOf({ density, widest }: ViolinRow, { at, middle, width }: Placement): string {
  /**
   * Returns the distance of a density's point from the middle: half the bar at the widest.
   */
  const extentOf = (value: number): number => (widest > 0 ? (value / widest) * (width / 2) : 0);
  const end = density.map((point) => `${middle + extentOf(point.density)},${at(point.value)}`);
  const start = density
    .toReversed()
    .map((point) => `${middle - extentOf(point.density)},${at(point.value)}`);

  return [...end, ...start].join(" ");
}

/**
 * Returns the marker inside the violin: the whisker line, the quartile bar and the median point.
 *
 * @param summary - The group's summary.
 * @param placement - Where values go within the group's bar.
 */
function markerOf(summary: BoxSummary, { at, middle, width }: Placement): ReactElement {
  const bar = Math.max(width * BAR, 3);
  const top = at(summary.q3);

  return (
    <>
      <line
        className={WHISKER}
        x1={middle}
        x2={middle}
        y1={at(summary.whiskerHigh)}
        y2={at(summary.whiskerLow)}
      />
      <rect
        className={QUARTILES}
        height={Math.max(at(summary.q1) - top, 1)}
        width={bar}
        x={middle - bar / 2}
        y={top}
      />
      <circle
        className={MEDIAN}
        cx={middle}
        cy={at(summary.median)}
        r={Math.max(bar * POINT, 2.5)}
        strokeWidth={1.5}
      />
    </>
  );
}

/**
 * Renders the violin, or nothing without a row.
 *
 * @param props - The group's bar and row, and the switches.
 */
export function ViolinShape({
  active = false,
  fill = "currentColor",
  payload,
  quartiles = true,
  ...bar
}: ViolinShapeProps): null | ReactElement {
  if (payload === undefined) return null;

  const placement = placementOf(payload.range, bar);

  return (
    <g>
      <polygon
        fill={fill}
        fillOpacity={active ? 0.5 : 0.28}
        points={outlineOf(payload, placement)}
        stroke={fill}
        strokeLinejoin="round"
        strokeWidth={active ? 2 : 1}
      />
      {quartiles ? markerOf(payload.summary, placement) : null}
    </g>
  );
}
