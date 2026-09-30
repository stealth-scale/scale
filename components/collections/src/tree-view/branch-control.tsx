/**
 * Renders the row of a branch, the element that takes focus for it.
 *
 * @remarks
 *   The row has the `treeitem` role with the branch's level, place, expanded, selected, disabled
 *   and busy states, so a screen reader announces them on focus. A press selects the branch and,
 *   unless the root sets `expandOnClick={false}`, opens or closes it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { rowed } from "#tree-view/rows.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `div` with the tree view's branch control class.
 */
const Controlled = withContext("div", "branchControl");

/**
 * Describes the props of a branch's row: the props of a `div`.
 */
export type BranchControlProps = ComponentProps<typeof Controlled>;

/**
 * Renders a branch's row with the machine's props and the tree semantics merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function BranchControl(props: BranchControlProps): ReactElement {
  const { api, checkable } = useTreeView();
  const node = useNode();
  const control: BranchControlProps = api.getBranchControlProps(node);

  return <Controlled {...mergeProps(control, rowed(api, node, checkable), props)} />;
}
