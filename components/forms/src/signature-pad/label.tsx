/**
 * Renders the words that name a signature pad.
 *
 * @remarks
 *   The element is a `label` for the hidden input, and a press on it focuses the control. It names
 *   the group and the control while it is mounted. Inside a field the field's label names them
 *   instead.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#signature-pad/context.ts";
import { useSignaturePad } from "#signature-pad/machine.ts";
import { useLabelled } from "#signature-pad/state.ts";

/**
 * Renders the `label` with the signature pad's label class.
 */
const Named = withContext("label", "label");

/**
 * Describes the props of the label: the props of a `label`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's props.
 *
 * @param props - Attributes and children of the `label` element, merged over the machine's.
 * @returns The `label` element.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useSignaturePad();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
