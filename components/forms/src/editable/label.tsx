/**
 * Renders the words that name an editable.
 *
 * @remarks
 *   The element is a `label` for the input, and it names the preview while it is mounted. A press
 *   on it while the preview shows moves focus to the preview.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";
import { useLabelled } from "#editable/state.ts";

/**
 * Renders the `label` with the editable's label class.
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
  const api = useEditable();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
