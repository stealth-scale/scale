/**
 * Renders the box the inputs and the triggers go in, which the panel opens under.
 *
 * @remarks
 *   The machine finds the text inputs by their part inside the control, so every input goes inside
 *   it. The two inputs of a range are one gap apart, with the caller's glyph between them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";

/**
 * Renders the `div` with the date picker's control class.
 */
const Held = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Held>;

/**
 * Renders the control with the machine's control props merged under the caller's.
 *
 * @param props - The inputs, the triggers and the props of a `div`.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  return <Held {...mergeProps(useDatePicker().getControlProps(), props)} />;
}
