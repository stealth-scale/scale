/**
 * Renders the mark at a checkable row's end, visible while the row is checked.
 *
 * @remarks
 *   The indicator reads the row's state from the item provider. The recipe orders it last, so it
 *   renders at the row's end wherever the caller writes it. The machine sets `hidden` on an
 *   unchecked row's mark. The part drops the attribute and the recipe hides the mark with
 *   `visibility`, so the panel's width does not change with the checked rows. The indicator sets
 *   `aria-hidden`, because the row reports `aria-checked`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu, useMenuItem } from "#menu/machine.ts";

/**
 * Renders the `span` with the menu's item indicator class.
 */
const Marked = withContext("span", "itemIndicator");

/**
 * Describes the props of the item indicator: the props of a `span`.
 */
export type ItemIndicatorProps = ComponentProps<typeof Marked>;

/**
 * Renders the mark with the machine's item indicator props, without `hidden`.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function ItemIndicator(props: ItemIndicatorProps): ReactElement {
  const { api } = useMenu();
  const item = useMenuItem();
  const { hidden: _hidden, ...shown } = api.getItemIndicatorProps(item);

  return <Marked {...mergeProps({ "aria-hidden": true }, shown, props)} />;
}
