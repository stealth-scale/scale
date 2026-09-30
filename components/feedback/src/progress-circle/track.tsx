/**
 * Renders the track, the whole ring under the range.
 *
 * @remarks
 *   The element is a `circle` the machine places at the middle of the ring with a radius and a
 *   stroke width read from `--size` and `--thickness`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#progress-circle/context.ts";
import { useProgress } from "#progress/machine.ts";

/**
 * Renders the track `circle`.
 */
const Whole = withContext("circle", "track");

/**
 * Describes the props of `Track`: the props of a `circle`.
 */
export type TrackProps = ComponentProps<typeof Whole>;

/**
 * Renders the track with the machine's geometry.
 *
 * @param props - The `circle` element's props.
 * @returns The `circle` element.
 */
export function Track(props: TrackProps): ReactElement {
  return <Whole {...mergeProps(useProgress().getCircleTrackProps(), props)} />;
}
