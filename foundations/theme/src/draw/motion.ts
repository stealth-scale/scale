/**
 * Draws the slide keyframes, sixteen movements from four directions and two distances.
 */

import { type CssKeyframes } from "#pandacss.ts";

/**
 * Lists each direction against the axis it moves on and the sign of the movement.
 */
const DIRECTIONS: ReadonlyArray<readonly [name: string, axis: "X" | "Y", sign: -1 | 1]> = [
  ["top", "Y", -1],
  ["bottom", "Y", 1],
  ["left", "X", -1],
  ["right", "X", 1],
];

/**
 * Writes the translation a slide starts or ends at, a distance along one axis in one direction.
 */
function moved(axis: "X" | "Y", sign: -1 | 1, distance: string): string {
  return `translate${axis}(${sign === -1 ? `calc(${distance} * -1)` : distance})`;
}

/**
 * Writes the keyframes of one direction: from it and to it, a short way and the whole way.
 *
 * @remarks
 *   The short slide reads its distance from a custom property named for the keyframe, so a recipe
 *   sets how far a thing travels without restating the movement.
 */
function slide(name: string, axis: "X" | "Y", sign: -1 | 1): Array<[string, CssKeyframes[string]]> {
  const short = `var(--slide-${name}-distance, 0.5rem)`;
  const still = { transform: `translate${axis}(0)` };

  return [
    [`slide-from-${name}`, { from: { transform: moved(axis, sign, short) }, to: still }],
    [`slide-from-${name}-full`, { from: { transform: moved(axis, sign, "100%") }, to: still }],
    [`slide-to-${name}`, { from: still, to: { transform: moved(axis, sign, short) } }],
    [`slide-to-${name}-full`, { from: still, to: { transform: moved(axis, sign, "100%") } }],
  ];
}

/**
 * Draws the sixteen slides, from `slide-from-top` to `slide-to-right-full`.
 */
export function slides(): CssKeyframes {
  return Object.fromEntries(DIRECTIONS.flatMap(([name, axis, sign]) => slide(name, axis, sign)));
}
