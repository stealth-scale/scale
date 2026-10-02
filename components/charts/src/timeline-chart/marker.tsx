/**
 * Renders a timeline's marker: a dot for one moment, or a pill with the count of a cluster.
 *
 * @remarks
 *   The marker's group has the marker class, its color in the custom property the recipe fills the
 *   dot or the pill with, and `data-walk` with its place in the keyboard walk. The dot's radius is
 *   6px. The pill is 20px tall and 7px wide per digit of its count and per side of the count, 21px
 *   for one digit, so a count of any length fits it. A marker the chart selects on a press marks
 *   itself with `data-press`, and the keyboard walk clicks it on Enter and Space. The marker at the
 *   chart's first place opens the tooltip at itself once it lays out.
 */

import { type ReactElement, useRef } from "react";

import { MARKER, MARKER_FILL } from "#chart/placed.ts";
import { useOpened } from "#chart/walk.ts";
import { type MarkerDatum } from "#timeline-chart/markers.ts";

/**
 * Radius of a marker of one moment, in pixels.
 */
const DOT = 6;

/**
 * Height of a cluster's pill, in pixels.
 */
const PILL = 20;

/**
 * Width a cluster's pill takes per digit of its count, and per side of the count, in pixels.
 */
const DIGIT = 7;

/**
 * Describes the props of a marker: its centre, its datum and what a press does.
 */
export interface MarkerProps {
  /**
   * Horizontal centre of the marker in pixels.
   */
  readonly cx: number;

  /**
   * Vertical centre of the marker in pixels.
   */
  readonly cy: number;

  /**
   * Marker the shape renders: its cluster, color and place in the walk.
   */
  readonly datum: MarkerDatum;

  /**
   * Place in the walk of the marker the tooltip opens at when the chart first renders, if any.
   */
  readonly initial?: number | undefined;

  /**
   * Called with the marker when a press or the keys select it.
   */
  readonly onPress?: ((datum: MarkerDatum) => void) | undefined;
}

/**
 * Renders the marker's dot or pill.
 *
 * @param props - The marker's centre, its datum, the chart's first place and the press.
 */
export function Marker({ cx, cy, datum, initial, onPress }: MarkerProps): ReactElement {
  const group = useRef<SVGGElement>(null);
  const count = datum.cluster.events.length;
  const width = (String(count).length + 2) * DIGIT;
  const style: Record<string, string> = { [MARKER_FILL]: datum.color };

  useOpened(group, datum.walk === initial);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the chart's keyboard walk clicks the marker on Enter and Space
    <g
      className={MARKER}
      data-press={onPress === undefined ? undefined : ""}
      data-walk={datum.walk}
      onClick={
        onPress === undefined
          ? undefined
          : () => {
              onPress(datum);
            }
      }
      ref={group}
      style={style}
    >
      {count > 1 ? (
        <>
          <rect height={PILL} rx={PILL / 2} width={width} x={cx - width / 2} y={cy - PILL / 2} />
          <text dominantBaseline="central" textAnchor="middle" x={cx} y={cy}>
            {count}
          </text>
        </>
      ) : (
        <circle cx={cx} cy={cy} r={DOT} />
      )}
    </g>
  );
}
