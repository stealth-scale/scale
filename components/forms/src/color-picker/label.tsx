/**
 * Renders the label that names the color picker.
 *
 * @remarks
 *   The element is a `label` pointing at the hidden input, and a press on it moves focus to the
 *   hex input in the control. The text input in the control, the trigger and the panel name
 *   themselves after it while it is mounted.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { useLabelled } from "#color-picker/state.ts";

/**
 * Renders the `label` with the color picker's label class.
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
  const api = useColorPicker();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
