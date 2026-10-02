/**
 * Renders the field's label.
 *
 * @remarks
 *   The element is a `label` whose `htmlFor` points at the control, so its text is the control's
 *   accessible name and a press on it focuses the control. It carries `data-disabled` while the
 *   field is disabled, so the disabled look reaches the text beside the control.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Renders the `label` with the field's label class.
 */
const Worded = withContext("label", "label");

/**
 * Describes the props of the label: the props of a `label`.
 */
export type LabelProps = ComponentProps<typeof Worded>;

/**
 * Renders the label, pointed at the control.
 *
 * @param props - Attributes and children of the `label` element.
 * @returns The `label` element, with its `for` attribute set to the control's identifier.
 */
export function Label(props: LabelProps): ReactElement {
  const { disabled, ids } = useField();

  return (
    <Worded data-disabled={disabled || undefined} htmlFor={ids.control} id={ids.label} {...props} />
  );
}
