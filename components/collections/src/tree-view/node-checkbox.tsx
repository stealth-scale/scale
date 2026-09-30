/**
 * Renders the box that shows a node's check in a checkable tree.
 *
 * @remarks
 *   The box is a pointer target: a press toggles the check and returns focus to the row. The row
 *   has `aria-checked` and Space toggles it, so the box is hidden from assistive technology and
 *   leaves the machine's `checkbox` role out. A branch's box is checked while every node under it
 *   is, and partly checked while some are. The caller passes the glyph as children, which the box
 *   shows while it is checked or partly checked.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `span` with the tree view's node checkbox class.
 */
const Boxed = withContext("span", "nodeCheckbox");

/**
 * Describes the props of a node checkbox: the props of a `span`.
 */
export type NodeCheckboxProps = ComponentProps<typeof Boxed>;

/**
 * Renders the box with the machine's props, less its role and focus, merged over the caller's.
 *
 * @param props - The props of a `span`, with the glyph as children.
 * @returns The `span` element.
 */
export function NodeCheckbox(props: NodeCheckboxProps): ReactElement {
  const { api } = useTreeView();
  const box: NodeCheckboxProps = {
    ...api.getNodeCheckboxProps(useNode()),
    "aria-checked": undefined,
    "aria-hidden": true,
    role: undefined,
    tabIndex: undefined,
  };

  return <Boxed {...mergeProps(box, props)} />;
}
