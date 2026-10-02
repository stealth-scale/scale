/**
 * Renders a button that opens the dialog.
 *
 * @remarks
 *   The element is a `button`, so a keyboard focuses it. The machine sets `aria-haspopup`,
 *   `aria-expanded`, `aria-controls` and the press handler. More than one trigger can open a
 *   dialog. Each passes its own `value`, and the machine reports the value of the one pressed as
 *   the root's `triggerValue`. Focus returns to that trigger when the dialog closes.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#dialog/context.ts";
import { useDialog } from "#dialog/machine.ts";

/**
 * Renders the `button` with the dialog's trigger class.
 */
const Drawn = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`, and the value that tells this
 * trigger apart from the dialog's other triggers.
 */
export interface TriggerProps extends Omit<ComponentProps<typeof Drawn>, "value"> {
  /**
   * The value the root reports as `triggerValue` while this trigger opened the dialog. Absent for a
   * dialog with one trigger.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the trigger with the machine's trigger props merged over the caller's.
 *
 * @param props - The value and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger({ value, ...props }: TriggerProps): ReactElement {
  const api = useDialog();

  return (
    <Drawn {...mergeProps(api.getTriggerProps(value === undefined ? {} : { value }), props)} />
  );
}
