/**
 * Renders one marker of a slider: a dot on the track at a value, and its words below the thumbs.
 *
 * @remarks
 *   The element is a `span` the machine places at `value`. The dot is in the range's contrast ink
 *   while the value is under the thumb, and in the muted ink after it. Children are the marker's
 *   words, and a marker without children is a dot alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";

/**
 * Renders the `span` with the slider's marker class.
 */
const Mark = withContext("span", "marker");

/**
 * Describes the props of a marker: its value and the props of a `span`.
 */
export interface MarkerProps extends ComponentProps<typeof Mark> {
  /**
   * The value the marker lies at.
   */
  readonly value: number;
}

/**
 * Renders the marker with the machine's props.
 *
 * @param props - The value and the props of the `span`, merged over the machine's.
 * @returns The `span` element.
 */
export function Marker({ value, ...rest }: MarkerProps): ReactElement {
  return <Mark {...mergeProps(useSlider().getMarkerProps({ value }), rest)} />;
}
