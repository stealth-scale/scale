/**
 * Writes a point's words beside it, such as a vendor's name on a quadrant chart.
 *
 * @remarks
 *   The words start 4px past the point's end edge. A point past 72% of the plot's width writes its
 *   words before its start edge instead, so they run toward the middle and end inside the plot.
 *   The words take no pointer events, so a pointer over them hits the point under them. Words that
 *   leave the plot's sides or meet the words of a point earlier in the series are hidden, so the
 *   first point of two close ones keeps its words. The tooltip still names a point whose words are
 *   hidden.
 */

import { type ReactElement, useRef } from "react";

import { Text, usePlotArea } from "recharts";

import { useCleared } from "#chart/cleared.ts";
import { POINT_LABEL } from "#chart/placed.ts";
import { NODE } from "#chart/recipe.ts";

/**
 * Share of the plot's width past which a point writes its words before it.
 */
const FLIP = 0.72;

/**
 * Space between a point's edge and its words, in pixels.
 */
const GAP = 4;

/**
 * Describes the props of a point's words: the point's box in pixels, its place and the words.
 */
export interface PointLabelProps {
  /**
   * Height of the point's symbol in pixels.
   */
  readonly height: number;

  /**
   * Place of the point among every point of the chart, series by series, which decides whose
   * words two close points keep.
   */
  readonly order: number;

  /**
   * Words in the point's field.
   */
  readonly value: unknown;

  /**
   * Width of the point's symbol in pixels.
   */
  readonly width: number;

  /**
   * Left edge of the point's symbol in pixels.
   */
  readonly x: number;

  /**
   * Top edge of the point's symbol in pixels.
   */
  readonly y: number;
}

/**
 * Renders the point's words, or nothing for a point without words.
 *
 * @param props - The point's box, its place and its words.
 */
export function PointLabel({
  height,
  order,
  value,
  width,
  x,
  y,
}: PointLabelProps): null | ReactElement {
  const group = useRef<SVGGElement>(null);
  const plot = usePlotArea();
  const words = typeof value === "string" || typeof value === "number" ? String(value) : undefined;

  useCleared(group, [x, y, words].join("\n"));

  if (words === undefined) return null;

  const back = plot !== undefined && x + width / 2 > plot.x + plot.width * FLIP;

  return (
    <g className={NODE} data-walk={order} ref={group}>
      <Text
        className={POINT_LABEL}
        textAnchor={back ? "end" : "start"}
        verticalAnchor="middle"
        x={back ? x - GAP : x + width + GAP}
        y={y + height / 2}
      >
        {words}
      </Text>
    </g>
  );
}
