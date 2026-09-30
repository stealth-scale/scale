/**
 * Renders the button that restores an editable's value from before editing.
 *
 * @remarks
 *   The button shows while the editable is being edited. A press outside the input does not save
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
export interface CancelTriggerProps extends Omit<ComponentProps<typeof Pressed>, "aria-label"> {
  /**
   * Accessible name of the button. Defaults to `Cancel`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the trigger with the machine's cancel props.
 *
 * @param props - The accessible name and the props of the `button`, merged over the machine's.
 * @returns The `button` element.
 */
export function CancelTrigger({ label = "Cancel", ...rest }: CancelTriggerProps): ReactElement {
  const api = useEditable();

  return <Pressed {...mergeProps(api.getCancelTriggerProps(), { "aria-label": label }, rest)} />;
}
