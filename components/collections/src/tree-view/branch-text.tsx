/**
 * Renders the text of a branch's row, on one line that the row cuts short.
 *
 * @remarks
 *   The text is hidden while the branch is renamed, and `TreeView.NodeRenameInput` takes its place.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `span` with the tree view's branch text class.
 */
const Texted = withContext("span", "branchText");

/**
 * Describes the props of a branch's text: the props of a `span`.
 */
export type BranchTextProps = ComponentProps<typeof Texted>;

/**
 * Renders the text with the machine's props merged over the caller's.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function BranchText(props: BranchTextProps): ReactElement {
  const { api } = useTreeView();

  return <Texted {...mergeProps(api.getBranchTextProps(useNode()), props)} />;
}
