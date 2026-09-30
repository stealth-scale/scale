/**
 * Renders a mark across the track at a value of the range, such as a target to reach.
 *
 * @remarks
 *   The marker is placed by its value's share of the range from `min` to `max`, and a value past
 *   either end is placed at that end, inside the track. It is hidden from assistive technology,
 *   because a line has no words: the caller writes the value it marks in `ValueText` and in the
 *   track's `aria-valuetext`. Whether reaching it is good news is the caller's to say through the
 *   root's palette, because a sales target reached is good news and a spending limit reached is
 *   not.
 */

import { type ComponentProps, type ReactElement } from "react";

import { clampValue, getValuePercent } from "@zag-js/utils";

import { MARKER } from "#bar.ts";
import { withContext } from "#progress/context.ts";
import { useProgress } from "#progress/machine.ts";

/**
 * Renders the marker `div`.
 */
const Marked = withContext("div", "marker");

/**
 * Describes the props of `Marker`: the value it marks and the props of a `div`.
 */
export interface MarkerProps extends ComponentProps<typeof Marked> {
  /**
   * Value the marker is placed at, in the units of `min` and `max`.
   */
  readonly value: number;
}

/**
 * Renders the marker at its value's share of the range.
 *
 * @param props - The value and the props of a `div`.
 * @returns The `div` element.
 */
export function Marker({ style, value, ...props }: MarkerProps): ReactElement {
  const { max, min } = useProgress();
  const share = getValuePercent(clampValue(value, min, max), min, max) * 100;
  const placed: Record<string, string> = { [MARKER]: `${String(share)}%` };

  return <Marked aria-hidden {...props} style={{ ...placed, ...style }} />;
}
