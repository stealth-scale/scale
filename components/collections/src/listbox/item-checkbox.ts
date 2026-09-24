/**
 * Renders the checkbox at the start of a row in a list that allows several selected rows.
 *
 * @remarks
 *   The checkbox shows before the first press that the list allows several rows. It reads the
 *   selected state from its parent row's `data-selected` or `data-state`, and from no further
 *   ancestor, because tabs, menus and other machines also set `data-selected`. It is `aria-hidden`,
 *   because the row reports `aria-selected`. It is not a control: the row is the target.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Renders the `span` with the listbox's item checkbox class, hidden from assistive technology.
 */
export const ItemCheckbox = withContext("span", "itemCheckbox", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of a row's checkbox: the props of a `span`.
 */
export type ItemCheckboxProps = ComponentProps<typeof ItemCheckbox>;
