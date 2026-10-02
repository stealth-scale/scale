/**
 * Renders the box the groups of segments and the clear trigger go in.
 *
 * @remarks
 *   The machine finds the segments by their part inside the control, in the order they render, so
 *   every segment of every group goes inside it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-input/context.ts";
import { useDateInput } from "#date-input/machine.ts";

/**
 * Renders the `div` with the date input's control class.
 */
const Held = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Held>;

/**
 * Renders the control with the machine's control props merged under the caller's.
 *
 * @param props - The groups, the clear trigger and the props of a `div`.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  return <Held {...mergeProps(useDateInput().getControlProps(), props)} />;
}
