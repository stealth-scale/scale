/**
 * Renders the dial of an angle slider, the circle that contains the ring, the thumb, the markers
 * and the value text.
 *
 * @remarks
 *   The element is a `div` in the `presentation` role. A press on it moves the thumb to the
 *   pressed angle and starts a drag. The value text and any other child in the flow centre in the
 *   circle.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#angle-slider/context.ts";
import { useAngleSlider } from "#angle-slider/machine.ts";

/**
 * Renders the `div` with the angle slider's control class.
 */
const Dial = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Dial>;

/**
 * Renders the control with the machine's props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  return <Dial {...mergeProps(useAngleSlider().getControlProps(), props)} />;
}
