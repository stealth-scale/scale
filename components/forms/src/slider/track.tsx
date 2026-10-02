/**
 * Renders a slider's track: the full length of the values.
 *
 * @remarks
 *   The element is a `div` with round ends, which clips the range inside it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";

/**
 * Renders the `div` with the slider's track class.
 */
const Line = withContext("div", "track");

/**
 * Describes the props of the track: the props of a `div`.
 */
export type TrackProps = ComponentProps<typeof Line>;

/**
 * Renders the track with the machine's props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function Track(props: TrackProps): ReactElement {
  return <Line {...mergeProps(useSlider().getTrackProps(), props)} />;
}
