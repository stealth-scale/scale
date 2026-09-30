/**
 * Renders every node of the collection, a branch around the nodes under it.
 *
 * @remarks
 *   The caller's function renders each node's row from the node and its state, and the component
 *   renders the containers and groups around the rows. The type of the nodes is the one the
 *   function declares for its details: the machine reads the caller's collection and types its
 *   nodes as unknown.
 */

import { type ReactElement, type ReactNode } from "react";

import { type NodeRender } from "#tree-view/details.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { Subtree } from "#tree-view/subtree.tsx";

/**
 * Describes the props of the nodes: the function that renders a row and the indent guide.
 *
 * @typeParam Node - Type of the collection's nodes.
 */
export interface NodesProps<Node> {
  /**
   * Element each branch's group of children renders first, such as `TreeView.BranchIndentGuide`.
   */
  readonly indentGuide?: ReactNode;

  /**
   * Returns a node's row: `TreeView.BranchControl` for a branch and `TreeView.Item` for an item.
   */
  readonly render: NodeRender<Node>;
}

/**
 * Renders the top-level nodes, each with the nodes under it.
 *
 * @typeParam Node - Type of the collection's nodes.
 * @param props - The render function and the indent guide.
 * @returns A fragment of one subtree per top-level node.
 */
export function Nodes<Node>({ indentGuide, render }: NodesProps<Node>): ReactElement {
  const { api } = useTreeView();
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the collection contains the nodes the render function declares
  const rendered = render as NodeRender<unknown>;

  return (
    <>
      {api.collection.getNodeChildren(api.collection.rootNode).map((node, index) => (
        <Subtree
          indentGuide={indentGuide}
          indexPath={[index]}
          key={api.collection.getNodeValue(node)}
          node={node}
          render={rendered}
        />
      ))}
    </>
  );
}
