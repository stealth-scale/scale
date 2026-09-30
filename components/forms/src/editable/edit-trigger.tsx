/**
 * Renders the button that opens an editable's input.
 *
 * @remarks
 *   The button shows while the editable is at rest and focus returns to it after Enter or Escape.
 *   A read-only editable hides it, because its value cannot be edited. It is the input group's
 *   square button, and the glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";
import { useShared } from "#editable/state.ts";

/**
 * Renders the `button` with the editable's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: its accessible name and the props of a `button`.
 */
export interface EditTriggerProps extends Omit<ComponentProps<typeof Pressed>, "aria-label"> {
  /**
   * Accessible name of the button. Defaults to `Edit`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the trigger with the machine's edit props.
 *
 * @param props - The accessible name and the props of the `button`, merged over the machine's.
 * @returns The `button` element.
 */
export function EditTrigger({ label = "Edit", ...rest }: EditTriggerProps): ReactElement {
  const api = useEditable();
  const { readOnly } = useShared();
  const named = { "aria-label": label, ...(readOnly ? { hidden: true } : {}) };

  return <Pressed {...mergeProps(api.getEditTriggerProps(), named, rest)} />;
}
