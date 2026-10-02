/**
 * Renders the label that names the select.
 *
 * @remarks
 *   The element is a `label` pointing at the hidden `select`, so a press on it moves focus to the
 *   trigger without opening the panel. The trigger and the panel name themselves after it while it
 *   is mounted.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#select/context.ts";
import { useSelect } from "#select/machine.ts";
import { useLabelled } from "#select/state.ts";

/**
 * Renders the `label` with the select's label class.
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
  const api = useSelect();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
