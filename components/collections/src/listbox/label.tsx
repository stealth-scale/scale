/**
 * Renders the label of the list.
 *
 * @remarks
 *   The machine points the list's `aria-labelledby` at the label. A list without a label states
 *   `aria-label` on the content.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Renders the `span` with the listbox's label class.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of the label: the props of a `span`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's label props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element the list's `aria-labelledby` references.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useListbox();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
