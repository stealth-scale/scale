/**
 * Renders the area a slider's track, thumbs and markers lie in.
 *
 * @remarks
 *   The element is a `div` inset by half a thumb at each end. A press on it moves the nearest
 *   thumb to the pressed value and starts a drag.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";

/**
 * Renders the `div` with the slider's control class.
 */
const Area = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Area>;

/**
 * Renders the control with the machine's props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  return <Area {...mergeProps(useSlider().getControlProps(), props)} />;
}
