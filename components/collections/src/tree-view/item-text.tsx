/**
 * Renders the text of an item's row, on one line that the row cuts short.
 *
 * @remarks
 *   The text is hidden while the item is renamed, and `TreeView.NodeRenameInput` takes its place.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `span` with the tree view's item text class.
 */
const Texted = withContext("span", "itemText");

/**
 * Describes the props of an item's text: the props of a `span`.
 */
export type ItemTextProps = ComponentProps<typeof Texted>;

/**
 * Renders the text with the machine's props merged over the caller's.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function ItemText(props: ItemTextProps): ReactElement {
  const { api } = useTreeView();

  return <Texted {...mergeProps(api.getItemTextProps(useNode()), props)} />;
}
