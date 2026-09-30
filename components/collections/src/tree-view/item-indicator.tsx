/**
 * Renders the mark at the end of a selected item's row.
 *
 * @remarks
 *   The caller passes the glyph as children, such as a check. The mark is `hidden` while the item
 *   is not selected and hidden from assistive technology always, because the row reports
 *   `aria-selected`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `span` with the tree view's item indicator class.
 */
const Indicated = withContext("span", "itemIndicator");

/**
 * Describes the props of an item indicator: the props of a `span`.
 */
export type ItemIndicatorProps = ComponentProps<typeof Indicated>;

/**
 * Renders the indicator with the machine's props merged over the caller's.
 *
 * @param props - The props of a `span`, with the glyph as children.
 * @returns The `span` element.
 */
export function ItemIndicator(props: ItemIndicatorProps): ReactElement {
  const { api } = useTreeView();

  return <Indicated {...mergeProps(api.getItemIndicatorProps(useNode()), props)} />;
}
