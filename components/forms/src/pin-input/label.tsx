/**
 * Renders the words that name the pin input.
 *
 * @remarks
 *   The label reports itself to the root while it is mounted, and the group is named by it from
 *   then on. A press on the label focuses the first box.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#pin-input/context.ts";
import { usePinInput } from "#pin-input/machine.ts";
import { useLabelled } from "#pin-input/state.ts";

/**
 * Renders the `label` with the pin input's label class.
 */
const Named = withContext("label", "label");

/**
 * Describes the props of the label: the props of a `label`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's ID and press handler.
 *
 * @param props - Attributes and children of the `label` element, merged over the machine's.
 * @returns The `label` element the group is named by.
 */
export function Label(props: LabelProps): ReactElement {
  const api = usePinInput();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
