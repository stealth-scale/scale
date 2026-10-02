/**
 * Writes a gauge's range under the two ends of its dial: the minimum under the start, the maximum
 * under the end.
 *
 * @remarks
 *   The component is a recharts child and reads the plot's box from the chart, where the dial's
 *   centre and largest circle are. Each value centres on its end of the reading's ring, below the
 *   end's lowest corner, so it clears the ring at any pair of angles with a gap between them. The
 *   text takes recharts' `recharts-label` class, which the recipe writes in the muted ink.
 */

import { type ReactElement } from "react";

import { Text, usePlotArea } from "recharts";

/**
 * Space between an end of the dial and the value under it, in pixels.
 */
const GAP = 4;

/**
 * Describes the props of the limits: the dial's angles and radii, and the range's two ends written
 * out.
 */
export interface GaugeLimitsProps {
  /**
   * Angle the dial ends at, in recharts' degrees.
   */
  readonly endAngle: number;

  /**
   * Radius of the reading ring's inner edge, a share of the largest circle.
   */
  readonly inner: number;

  /**
   * Maximum of the range, written out.
   */
  readonly max: string;

  /**
   * Minimum of the range, written out.
   */
  readonly min: string;

  /**
   * Radius of the dial's outer edge, a share of the largest circle.
   */
  readonly outer: number;

  /**
   * Radius of the reading ring's outer edge, a share of the largest circle.
   */
  readonly reading: number;

  /**
   * Angle the dial starts at, in recharts' degrees.
   */
  readonly startAngle: number;
}

/**
 * Describes the plot's box recharts measures: its top-left corner, its width and its height.
 */
type Box = NonNullable<ReturnType<typeof usePlotArea>>;

/**
 * Describes where a value is written: the point its text centres on and hangs from.
 */
interface Anchor {
  /**
   * Horizontal position of the text's centre.
   */
  readonly x: number;

  /**
   * Vertical position of the text's top.
   */
  readonly y: number;
}

/**
 * Returns where the value at one end of the dial is written: under the end's lowest corner, on the
 * middle of the reading's ring.
 *
 * @param angle - The end's angle in recharts' degrees, counter-clockwise from 3 o'clock.
 * @param box - The plot's box.
 * @param props - The dial's radii.
 */
function anchorOf(
  angle: number,
  box: Box,
  props: Pick<GaugeLimitsProps, "inner" | "outer" | "reading">,
): Anchor {
  const radius = Math.min(box.width, box.height) / 2;
  const radians = (angle * Math.PI) / 180;
  const lowest = Math.max(-props.inner * Math.sin(radians), -props.outer * Math.sin(radians));

  return {
    x: box.x + box.width / 2 + radius * ((props.inner + props.reading) / 2) * Math.cos(radians),
    y: box.y + box.height / 2 + radius * lowest + GAP,
  };
}

/**
 * Renders the minimum under the dial's start and the maximum under its end, or nothing outside a
 * chart.
 *
 * @param props - The dial's angles and radii, and the range's ends written out.
 */
export function GaugeLimits(props: GaugeLimitsProps): null | ReactElement {
  const box = usePlotArea();

  if (box === undefined) return null;

  const start = anchorOf(props.startAngle, box, props);
  const end = anchorOf(props.endAngle, box, props);

  return (
    <g className="chart-limits">
      <Text className="recharts-label" textAnchor="middle" verticalAnchor="start" {...start}>
        {props.min}
      </Text>
      <Text className="recharts-label" textAnchor="middle" verticalAnchor="start" {...end}>
        {props.max}
      </Text>
    </g>
  );
}
