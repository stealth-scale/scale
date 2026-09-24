/**
 * Renders the mark at the end of a selected row.
 *
 * @remarks
 *   The mark is `aria-hidden`, because the row reports `aria-selected`. The machine sets `hidden`
 *   on the mark of an unselected row. The part drops the attribute and the recipe hides the mark
 *   with `visibility`, so every row keeps the mark's width and the list's width does not change
 *   with the selection.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { type ListboxItem, useListbox } from "#listbox/machine.ts";

/**
 * Renders the `span` with the listbox's item indicator class, hidden from assistive technology.
 */
const Marked = withContext("span", "itemIndicator", { defaultProps: { "aria-hidden": true } });

/**
 * Describes the props of a row's mark: its collection item and the props of a `span`.
 */
export interface ItemIndicatorProps extends ComponentProps<typeof Marked> {
  /**
   * Collection item the mark belongs to.
   */
  readonly item: ListboxItem;
}

/**
 * Renders a row's mark with the machine's indicator props, without `hidden`.
 *
 * @param props - The collection item, and the attributes and children of the `span` element.
 * @returns The `span` element, visible while the row is selected.
 */
export function ItemIndicator({ item, ...rest }: ItemIndicatorProps): ReactElement {
  const api = useListbox();
  const { hidden: _hidden, ...shown } = api.getItemIndicatorProps({ item });

  return <Marked {...mergeProps(shown, rest)} />;
}
