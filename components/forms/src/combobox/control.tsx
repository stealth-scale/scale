/**
 * Renders the box around the input, the trigger and the clear trigger.
 *
 * @remarks
 *   The trigger and the clear trigger lie over the input's end, placed against this box, and the
 *   input keeps room at its end for both. The panel opens under this box.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#combobox/context.ts";
import { useCombobox } from "#combobox/machine.ts";

/**
 * Renders the `div` with the combobox's control class.
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
  const api = useCombobox();

  return <Held {...mergeProps(api.getControlProps(), props)} />;
}
