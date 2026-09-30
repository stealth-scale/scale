/**
 * Renders the mark of a branch's row that turns a quarter as the branch opens.
 *
 * @remarks
 *   The caller passes the glyph as children, such as a chevron pointing to the inline end. The mark
 *   is hidden from assistive technology, because the row reports `aria-expanded`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `span` with the tree view's branch indicator class.
 */
const Indicated = withContext("span", "branchIndicator");

/**
 * Describes the props of a branch indicator: the props of a `span`.
 */
export type BranchIndicatorProps = ComponentProps<typeof Indicated>;

/**
 * Renders the indicator with the machine's props merged over the caller's.
 *
 * @param props - The props of a `span`, with the glyph as children.
 * @returns The `span` element.
 */
export function BranchIndicator(props: BranchIndicatorProps): ReactElement {
  const { api } = useTreeView();

  return <Indicated {...mergeProps(api.getBranchIndicatorProps(useNode()), props)} />;
}
