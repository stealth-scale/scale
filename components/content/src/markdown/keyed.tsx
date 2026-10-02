/**
 * Keys the rendered children of a node by their place in the tree.
 *
 * @remarks
 *   A node of a Markdown tree has no identity beyond its place, and a document that streams in only
 *   appends, so a block keeps its key while text arrives after it.
 */

import { Fragment, type ReactNode } from "react";

/**
 * Renders each node and keys the result by the node's index.
 *
 * @typeParam Node - One node of the tree.
 */
export function each<Node>(
  nodes: readonly Node[],
  render: (node: Node, index: number) => ReactNode,
): ReactNode[] {
  return nodes.map((node, index) => (
    // eslint-disable-next-line react/no-array-index-key -- A node has no identity beyond its place, and a streamed document only appends.
    <Fragment key={index}>{render(node, index)}</Fragment>
  ));
}
