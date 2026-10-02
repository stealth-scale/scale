/**
 * Renders the row of buttons that run the timer.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#timer/context.ts";
import { useTimer } from "#timer/machine.ts";

/**
 * Renders the `div` with the timer's control class.
 */
const Controlled = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Controlled>;

/**
 * Renders the control with the machine's props merged under the caller's.
 *
 * @param props - The props of a `div`, with the action triggers as children.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  const { api } = useTimer();

  return <Controlled {...mergeProps(api.getControlProps(), props)} />;
}
