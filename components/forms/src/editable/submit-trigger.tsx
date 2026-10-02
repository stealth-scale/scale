/**
 * Renders the button that saves an editable's value.
 *
 * @remarks
 *   The button shows while the editable is being edited. A press outside the input does not cancel
 *   when it lands on this button. It is the input group's square button, and the glyph is the
 *   caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";

/**
 * Renders the `button` with the editable's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: its accessible name and the props of a `button`.
 */
export interface SubmitTriggerProps extends Omit<ComponentProps<typeof Pressed>, "aria-label"> {
  /**
   * Accessible name of the button. Defaults to `Save`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the trigger with the machine's submit props.
 *
 * @param props - The accessible name and the props of the `button`, merged over the machine's.
 * @returns The `button` element.
 */
export function SubmitTrigger({ label = "Save", ...rest }: SubmitTriggerProps): ReactElement {
  const api = useEditable();

  return <Pressed {...mergeProps(api.getSubmitTriggerProps(), { "aria-label": label }, rest)} />;
}
