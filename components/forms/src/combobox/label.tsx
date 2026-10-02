/**
 * Renders the label that names the combobox.
 *
 * @remarks
 *   The element is a `label` for the input, so it names the input and a press on it moves focus
 *   to the input. The panel names itself after it while it is mounted.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#combobox/context.ts";
import { useCombobox } from "#combobox/machine.ts";
import { useLabelled } from "#combobox/state.ts";

/**
 * Renders the `label` with the combobox's label class.
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
  const api = useCombobox();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
