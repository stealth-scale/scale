/**
 * Renders the check at the end of a selected row.
 *
 * @remarks
 *   The check is the caller's glyph and is `aria-hidden`, because the row reports `aria-selected`.
 *   The machine sets `hidden` on the check of an unselected row. The part drops the attribute and
 *   the recipe hides the check with `visibility`, so every row keeps the check's width and the
 *   rows' text ends on one line.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#combobox/context.ts";
import { type ComboboxItem, useCombobox } from "#combobox/machine.ts";

/**
 * Renders the `span` with the combobox's item indicator class.
 */
const Checked = withContext("span", "itemIndicator");

/**
 * Describes the props of a row's check: its collection item, its glyph and the props of a `span`.
 */
export interface ItemIndicatorProps extends ComponentProps<typeof Checked> {
  /**
   * Collection item the check belongs to.
   */
  readonly item: ComboboxItem;
}

/**
 * Renders a row's check with the machine's indicator props, without `hidden`.
 *
 * @param props - The collection item, the glyph and the props of a `span`.
 * @returns The `span` element, visible while the row is selected.
 */
export function ItemIndicator({ item, ...rest }: ItemIndicatorProps): ReactElement {
  const api = useCombobox();
  const { hidden: _hidden, ...shown } = api.getItemIndicatorProps({ item });

  return <Checked {...mergeProps(shown, rest)} />;
}
