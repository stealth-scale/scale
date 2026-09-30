/**
 * Renders the words that name the group.
 *
 * @remarks
 *   The label reports itself to the root while it is mounted, and the root is named by it from
 *   then on. A press on the label focuses the checked input, or the first enabled one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#radio-group/context.ts";
import { useRadioGroup } from "#radio-group/machine.ts";
import { useLabelled } from "#radio-group/state.ts";

/**
 * Renders the `span` with the radio group's label class.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of the label: the props of a `span`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's ID.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element the group is labelled by.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useRadioGroup();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
