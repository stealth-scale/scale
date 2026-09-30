/**
 * Renders the box around the trigger, the indicator and the clear trigger.
 *
 * @remarks
 *   The indicator and the clear trigger lie over the trigger's end, placed against this box, and
 *   the trigger keeps room at its end for both.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#select/context.ts";
import { useSelect } from "#select/machine.ts";

/**
 * Renders the `div` with the select's control class.
 */
const Held = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Held>;

/**
 * Renders the control with the machine's control props.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useSelect();

  return <Held {...mergeProps(api.getControlProps(), props)} />;
}
