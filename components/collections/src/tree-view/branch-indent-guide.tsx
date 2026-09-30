/**
 * Renders the line that runs down a branch's group of children, under the branch's indicator.
 *
 * @remarks
 *   Pass it to `TreeView.Nodes` as `indentGuide`, which renders it first in every group. The line
 *   is a border, so forced colors paint it, and it is hidden from assistive technology.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `div` with the tree view's branch indent guide class.
 */
const Guided = withContext("div", "branchIndentGuide");

/**
 * Describes the props of an indent guide: the props of a `div`.
 */
export type BranchIndentGuideProps = ComponentProps<typeof Guided>;

/**
 * Renders the guide with the machine's props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function BranchIndentGuide(props: BranchIndentGuideProps): ReactElement {
  const { api } = useTreeView();
  const guide: BranchIndentGuideProps = {
    ...api.getBranchIndentGuideProps(useNode()),
    "aria-hidden": true,
  };

  return <Guided {...mergeProps(guide, props)} />;
}
