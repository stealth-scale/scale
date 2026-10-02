/**
 * Renders a radial bar chart's rings: recharts' `RadialBar` over each row's turn, with the track
 * of each ring behind it.
 */

import { type ReactElement } from "react";

import { RadialBar, type RadialBarProps } from "recharts";

/**
 * Describes what the rings are built from.
 */
export interface RingBarOptions {
  /**
   * Whether the rings grow in, which they do only outside reduced motion.
   */
  readonly animate: boolean;

  /**
   * Whether each ring's remainder renders as a track behind it.
   */
  readonly track: boolean;
}

/**
 * Returns recharts' `RadialBar` of the rows' turns.
 *
 * @param options - The animation and track switches.
 */
export function ringBarOf({ animate, track }: RingBarOptions): ReactElement<RadialBarProps> {
  return (
    <RadialBar background={track} dataKey="turn" isAnimationActive={animate ? "auto" : false} />
  );
}
