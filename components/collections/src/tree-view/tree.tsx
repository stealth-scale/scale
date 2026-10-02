/**
 * Renders the element with the `tree` role around the rows.
 *
 * @remarks
 *   The tree handles the keys: the arrows, Home, End, Enter, Space, `*` for the siblings of the
 *   focused branch, and typeahead. It is named by `TreeView.Label` while a label is mounted, or by
 *   the caller's `aria-label`. The machine's own name, "Tree View", is dropped.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";

/**
 * Renders the `div` with the tree view's tree class.
 */
const Treed = withContext("div", "tree");

/**
 * Describes the props of the tree: the props of a `div`.
 */
export type TreeProps = ComponentProps<typeof Treed>;

/**
 * Renders the tree with the machine's tree props merged over the caller's.
 *
 * @param props - The props of a `div`, `aria-label` among them.
 * @returns The `div` element.
 */
export function Tree(props: TreeProps): ReactElement {
  const { api, labelledBy } = useTreeView();
  const tree: TreeProps = {
    ...api.getTreeProps(),
    "aria-label": undefined,
    "aria-labelledby": labelledBy,
  };

  return <Treed {...mergeProps(tree, props)} />;
}
