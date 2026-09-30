/**
 * Renders the words that name a tags input.
 *
 * @remarks
 *   The element is a `label` for the input, so a press on it focuses the input, and it names the
 *   group while it is mounted. Inside a field the field's label names both instead.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tags-input/context.ts";
import { useTagsInput } from "#tags-input/machine.ts";
import { useLabelled } from "#tags-input/state.ts";

/**
 * Renders the `label` with the tags input's label class.
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
  const api = useTagsInput();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
