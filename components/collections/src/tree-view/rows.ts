/**
 * Prepares the props of the focusable row that has a node's tree semantics.
 *
 * @remarks
 *   The machine marks a branch's container as the `treeitem` and gives focus to the branch's
 *   control, a `role=button` without the branch's state, so a screen reader announces a focused
 *   branch as a button. A screen reader announces the role, the level, the position and the states
 *   of the focused element, so the focusable row takes the `treeitem` role, the level, the place
 *   among its siblings, the expanded, selected, disabled and busy states, and in a checkable tree
 *   the check. The container drops them.
 */

import { type ComponentProps, type FocusEvent, type KeyboardEvent } from "react";

import { isFocusVisible } from "@zag-js/focus-visible";
import { type CheckedState, type NodeProps } from "@zag-js/tree-view";

import { type TreeViewApi } from "#tree-view/machine.ts";

/**
 * Describes the tree semantics of a focusable row, the key handler that checks it and the focus
 * handlers that mark a focus from the keyboard, typed as a `div` declares them.
 */
export type Rowed = Pick<
  ComponentProps<"div">,
  | "aria-busy"
  | "aria-checked"
  | "aria-disabled"
  | "aria-expanded"
  | "aria-level"
  | "aria-posinset"
  | "aria-selected"
  | "aria-setsize"
  | "onBlur"
  | "onFocus"
  | "onKeyDown"
  | "role"
>;

/**
 * Returns the value `aria-checked` takes for a node's check.
 *
 * @param checked - The node's check: on, off, or partly on for a branch.
 * @returns `true`, `false` or `mixed`.
 */
export function ariaChecked(checked: CheckedState): "mixed" | boolean {
  return checked === "indeterminate" ? "mixed" : checked;
}

/**
 * Returns the tree semantics of a node's focusable row, and its key and focus handlers.
 *
 * @remarks
 *   In a checkable tree, Space toggles the check and the machine's own Space, which selects, does
 *   not run: the handler cancels the key before the tree's handler runs. The arrows move
 *   focus from a script, and Firefox matches `:focus-visible` on such a focus only when the element
 *   before it matched, which a row focused by a press does not. A row focused while the last input
 *   was a key sets `data-focus-visible`, which the ring's condition matches in every browser.
 * @param api - The connected machine.
 * @param node - The node and its index path.
 * @param checkable - Whether the tree's rows have a check.
 * @returns The row's role, states and handlers.
 */
export function rowed(api: TreeViewApi, node: NodeProps, checkable: boolean): Rowed {
  const state = api.getNodeState(node);

  return {
    "aria-busy": state.loading ? true : undefined,
    "aria-checked": checkable ? ariaChecked(state.checked) : undefined,
    "aria-disabled": state.disabled ? true : undefined,
    "aria-expanded": state.isBranch ? state.expanded : undefined,
    "aria-level": state.depth,
    "aria-posinset": Number(node.indexPath.at(-1)) + 1,
    "aria-selected": state.disabled ? undefined : state.selected,
    "aria-setsize": api.collection.getSiblingNodes(node.indexPath).length,
    onBlur: (event: FocusEvent<HTMLElement>): void => {
      event.currentTarget.toggleAttribute("data-focus-visible", false);
    },
    onFocus: (event: FocusEvent<HTMLElement>): void => {
      event.currentTarget.toggleAttribute("data-focus-visible", isFocusVisible());
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>): void => {
      if (!checkable || event.key !== " " || state.disabled) return;

      event.preventDefault();
      api.toggleChecked(state.value, state.isBranch);
    },
    role: "treeitem",
  };
}
