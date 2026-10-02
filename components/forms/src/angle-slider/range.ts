/**
 * Renders the part of an angle slider's ring from the top to the value.
 *
 * @remarks
 *   The element is a `div` inside the track, filled with a conic gradient that reads the root's
 *   `--value`, so no script places it. It fills in the palette's solid, and in `Highlight` under
 *   forced colors.
 */

import { type ComponentProps } from "react";

import { withContext } from "#angle-slider/context.ts";

/**
 * Renders the `div` with the angle slider's range class.
 */
export const Range = withContext("div", "range");

/**
 * Describes the props of the range: the props of a `div`.
 */
export type RangeProps = ComponentProps<typeof Range>;
