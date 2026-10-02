/**
 * Renders the text of one row.
 *
 * @remarks
 *   The text truncates to one line.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#combobox/context.ts";
import { type ComboboxItem, useCombobox } from "#combobox/machine.ts";

/**
 * Renders the `span` with the combobox's item text class.
 */
const Named = withContext("span", "itemText");

/**
 * Describes the props of a row's text: its collection item and the props of a `span`.
 */
export interface ItemTextProps extends ComponentProps<typeof Named> {
  /**
   * Collection item the text belongs to.
   */
  readonly item: ComboboxItem;
}

/**
 * Renders a row's text with the machine's item text props.
 *
 * @param props - The collection item, and the attributes and children of the `span` element.
 * @returns The `span` element.
 */
export function ItemText({ item, ...rest }: ItemTextProps): ReactElement {
  const api = useCombobox();

  return <Named {...mergeProps(api.getItemTextProps({ item }), rest)} />;
}
