/**
 * Renders one marker of an angle slider: a dot on the ring at an angle.
 *
 * @remarks
 *   The element is a `span` the machine turns to `value`, which the recipe moves out onto the
 *   ring. The dot is in the range's contrast ink while the value has passed it, and in the muted
 *   ink after it. A marker has no words, because words turned with the dial would read upside
 *   down.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#angle-slider/context.ts";
import { useAngleSlider } from "#angle-slider/machine.ts";

/**
 * Renders the `span` with the angle slider's marker class.
 */
const Dot = withContext("span", "marker");

/**
 * Describes the props of a marker: its angle and the props of a `span` without children.
 */
export interface MarkerProps extends Omit<ComponentProps<typeof Dot>, "children"> {
  /**
   * The angle the marker lies at, in degrees.
   */
  readonly value: number;
}

/**
 * Renders the marker with the machine's props.
 *
 * @param props - The angle and the props of the `span`, merged over the machine's.
 * @returns The `span` element.
 */
export function Marker({ value, ...rest }: MarkerProps): ReactElement {
  return <Dot {...mergeProps(useAngleSlider().getMarkerProps({ value }), rest)} />;
}
