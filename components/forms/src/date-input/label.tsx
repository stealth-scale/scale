/**
 * Renders the label that names the date input.
 *
 * @remarks
 *   The element is a `label` pointing at the first group's hidden input, and a press on it moves
 *   focus to the first segment. The groups of segments name themselves after it while it is
 *   mounted.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-input/context.ts";
import { useDateInput } from "#date-input/machine.ts";
import { useLabelled } from "#date-input/state.ts";

/**
 * Renders the `label` with the date input's label class.
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
  const api = useDateInput();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
