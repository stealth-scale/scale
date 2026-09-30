/**
 * Renders the label that names the date picker.
 *
 * @remarks
 *   The element is a `label` pointing at the first text input, so a press on it focuses the input.
 *   The inputs, the trigger and the panel name themselves after it while it is mounted.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useLabelled } from "#date-picker/state.ts";

/**
 * Renders the `label` with the date picker's label class.
 */
const Named = withContext("label", "label");

/**
 * Describes the props of the label: the props of a `label`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's label props, and reports it to the root.
 *
 * @param props - The props of a `label`.
 * @returns The `label` element.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useDatePicker();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
