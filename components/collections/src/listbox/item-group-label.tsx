/**
 * Renders the label of a group of rows.
 *
 * @remarks
 *   The label has `role="presentation"` and the group's `aria-labelledby` references it, so a
 *   screen reader reads it as the group's name and never as a row.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Renders the `span` with the listbox's item group label class.
 */
const Headed = withContext("span", "itemGroupLabel");

/**
 * Describes the props of a group label: its group's identifier and the props of a `span`.
 */
export interface ItemGroupLabelProps extends ComponentProps<typeof Headed> {
  /**
   * Identifier of the group the label names.
   */
  readonly htmlFor: string;
}

/**
 * Renders a group label with the machine's item group label props.
 *
 * @param props - The group's identifier, and the attributes and children of the `span` element.
 * @returns The `span` element the group's `aria-labelledby` references.
 */
export function ItemGroupLabel({ htmlFor, ...rest }: ItemGroupLabelProps): ReactElement {
  const api = useListbox();

  return <Headed {...mergeProps(api.getItemGroupLabelProps({ htmlFor }), rest)} />;
}
