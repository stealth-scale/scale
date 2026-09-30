/**
 * Renders a chord diagram's arc: the node's span of the ring in its color, and its name outside the
 * ring at the arc's middle.
 *
 * @remarks
 *   A name on the ring's right half starts at the arc's middle and a name on its left half ends
 *   there, so every name reads away from the ring. The name takes the kit's share class: the ink
 *   inside a halo in the panel's color, and no pointer. After layout the arc hides its name where
 *   it leaves the plot's sides or meets a name an earlier arc shows. The arc's group has
 *   `data-walk` with its place in the keyboard walk, and `data-trace="dimmed"` while the readout is
 *   at another mark, which the recipe fades. A node that only receives has an arc of no length,
 *   which renders its name alone.
 */

import { type ReactElement, useRef } from "react";

import { Sector, Text } from "recharts";

import { useCleared } from "#chart/cleared.ts";
import { NODE, SHARE } from "#chart/recipe.ts";
import { type ArcMark, type Trace } from "#chord-diagram/marks.ts";
import { degreesOf, pointOf, type Ring } from "#chord-diagram/paths.ts";

/**
 * Space between the ring and a name, in pixels.
 */
const INSET = 8;

/**
 * Describes the props of an arc: its mark, its color, the ring, its trace and the pointer's
 * handlers.
 */
export interface ArcProps {
  /**
   * CSS value of the node's color.
   */
  readonly color: string;

  /**
   * The node's arc, name and place in the walk.
   */
  readonly mark: ArcMark;

  /**
   * Moves the readout to the arc when the pointer enters it.
   */
  readonly onEnter: () => void;

  /**
   * Clears the readout when the pointer leaves the arc.
   */
  readonly onLeave: () => void;

  /**
   * The ring the arc is part of.
   */
  readonly ring: Ring;

  /**
   * How the recipe paints the arc while the readout is at a mark.
   */
  readonly trace: Trace;
}

/**
 * Renders the arc in its color and its name outside the ring.
 *
 * @param props - The mark, the color, the ring, the trace and the pointer's handlers.
 */
export function Arc({ color, mark, onEnter, onLeave, ring, trace }: ArcProps): ReactElement {
  const group = useRef<SVGGElement>(null);
  const { endAngle, startAngle } = mark.group;
  const middle = (startAngle + endAngle) / 2;
  const at = pointOf(middle, ring.outer + INSET, ring.centre);

  useCleared(group, [at.x, at.y, mark.title].join("\n"));

  return (
    <g
      className={NODE}
      data-trace={trace}
      data-walk={mark.walk}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      ref={group}
    >
      <Sector
        cx={ring.centre.x}
        cy={ring.centre.y}
        endAngle={degreesOf(endAngle)}
        fill={color}
        innerRadius={ring.inner}
        outerRadius={ring.outer}
        startAngle={degreesOf(startAngle)}
      />
      <Text
        className={SHARE}
        textAnchor={middle < Math.PI ? "start" : "end"}
        verticalAnchor="middle"
        x={at.x}
        y={at.y}
      >
        {mark.title}
      </Text>
    </g>
  );
}
