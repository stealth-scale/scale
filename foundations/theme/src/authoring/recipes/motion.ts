/**
 * Writes the motion a thing enters and leaves with, and the `motion` axis a component offers, as
 * animation styles the theme owns.
 */

import { type Axis, axis } from "#authoring/recipes/axis.ts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Selects one of the motions a component offers: the three a thing enters with, and the four that
 * run for as long as the thing is there.
 */
export type Motion =
  | "fade"
  | "float"
  | "reveal"
  | "rise"
  | "shimmer"
  | "spin"
  | "sweep"
  | "twinkle";

/**
 * Maps each motion to the animation style that draws it.
 *
 * @remarks
 *   A style stated in two directions is named by the direction a component enters in, because a
 *   component that states `fade` and gets the pair animates nothing.
 */
const STYLES: Readonly<Record<Motion, string>> = {
  fade: "fade.in",
  float: "float",
  reveal: "reveal",
  rise: "rise",
  shimmer: "shimmer",
  spin: "spin",
  sweep: "sweep",
  twinkle: "twinkle",
};

/**
 * Lists the motions in the order a README reads them: the entrances, then the loops.
 */
export const MOTIONS: readonly Motion[] = [
  "fade",
  "rise",
  "reveal",
  "float",
  "spin",
  "twinkle",
  "shimmer",
  "sweep",
];

/**
 * Writes the `motion` axis of a component, each value reading the animation style that draws it.
 */
export const motionVariants: Axis<Motion> = axis(MOTIONS, (name) => ({
  animationStyle: STYLES[name],
}));

/**
 * Writes the open and closed states of a thing that animates, each reading an animation style.
 *
 * @param enter - The animation style the thing opens with.
 * @param exit - The animation style it closes with.
 */
export function motion(enter: string, exit: string): SystemStyleObject {
  return { _closed: { animationStyle: exit }, _open: { animationStyle: enter } };
}
