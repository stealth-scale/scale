/**
 * Describes what `TreeView.Nodes` passes to the function that renders a node's row.
 */

import { type ReactNode } from "react";

import { type NodeState } from "@zag-js/tree-view";

/**
 * Describes a node as the render function receives it: the node, its place and its state.
 *
 * @typeParam Node - Type of the collection's nodes.
 */
export interface NodeDetails<Node> {
  /**
   * Positions of the node and of each ancestor among their siblings, from the top.
   */
  readonly indexPath: readonly number[];

  /**
   * The node, as the collection stores it.
   */
  readonly node: Node;

  /**
   * State of the node: whether it is a branch, expanded, selected, checked, disabled, loading,
   * being renamed, and its depth.
   */
  readonly nodeState: NodeState;
}

/**
 * Describes the function that renders a node's row: `TreeView.BranchControl` for a branch and
 * `TreeView.Item` for an item.
 *
 * @typeParam Node - Type of the collection's nodes.
 */
export type NodeRender<Node> = (details: NodeDetails<Node>) => ReactNode;
