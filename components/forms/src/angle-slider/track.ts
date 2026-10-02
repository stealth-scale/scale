/**
 * Renders the ring of an angle slider: the full turn of the values.
 *
 * @remarks
 *   The element is a `div` over the whole dial, masked to the ring's thickness, so the range inside
 *   it is clipped to the same ring.
 */

import { type ComponentProps } from "react";

import { withContext } from "#angle-slider/context.ts";

/**
 * Renders the `div` with the angle slider's track class.
 */
export const Track = withContext("div", "track");

/**
 * Describes the props of the track: the props of a `div`.
 */
export type TrackProps = ComponentProps<typeof Track>;
