/**
 * Renders a tick of an axis whose two ends are named in place of its values, such as "Rare" and
 * "Certain" along a likelihood.
 *
 * @remarks
 *   The axis takes two ticks, at the low end and at the high end, and each writes its end's name
 *   at the place recharts gives its own tick label, in the same class. Each name is anchored toward
 *   the middle of the axis: along the x axis the low end's name starts at its tick and the high
 *   end's name ends at it, and along the y axis the low end's name is above its tick and the high
 *   end's name below it. So no name runs past the plot's edge, and the low ends' names of the two
 *   axes do not meet in the corner.
 */

import { type ReactElement } from "react";

import { Text } from "recharts";

/**
 * Class recharts gives its own tick labels, which the recipe colors.
 */
const TICK_VALUE = "recharts-cartesian-axis-tick-value";

/**
 * Lists the anchors of the names along each axis, the low end's first.
 */
const ANCHORS = {
  x: { text: ["start", "end"], vertical: ["start", "start"] },
  y: { text: ["end", "end"], vertical: ["end", "start"] },
} as const;

/**
 * Describes the props of an end's tick: the axis, the names of both ends, and where the tick is.
 */
export interface EndTickProps {
  /**
   * Axis the tick belongs to.
   */
  readonly axis: "x" | "y";

  /**
   * Words for the axis' two ends, the low end's first.
   */
  readonly ends: readonly [string, string];

  /**
   * Place of the tick among the axis' two ticks: 0 at the low end, 1 at the high end.
   */
  readonly index: number;

  /**
   * Horizontal place of the tick's label in pixels.
   */
  readonly x: number;

  /**
   * Vertical place of the tick's label in pixels.
   */
  readonly y: number;
}

/**
 * Renders the name of the end a tick is at.
 *
 * @param props - The axis, the names and the place of the tick's label.
 */
export function EndTick({ axis, ends, index, x, y }: EndTickProps): ReactElement {
  const end = index > 0 ? 1 : 0;

  return (
    <Text
      className={TICK_VALUE}
      textAnchor={ANCHORS[axis].text[end]}
      verticalAnchor={ANCHORS[axis].vertical[end]}
      x={x}
      y={y}
    >
      {ends[end]}
    </Text>
  );
}
