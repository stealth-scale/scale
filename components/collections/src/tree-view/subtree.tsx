/**
 * Renders one node of the tree and, for an expanded branch, the nodes under it.
 *
 * @remarks
 *   A branch renders its container, the caller's row and, while it is expanded, the group of its
 *   children with the indent guide first. A collapsed branch renders no group, so the rows under it
 *   are not in the document. An item renders the caller's row alone. The branch's container drops
 *   the machine's `treeitem` role and states, which the branch's focusable row has.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { withContext } from "#tree-view/context.ts";
import { type NodeRender } from "#tree-view/details.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { NodeProvider } from "#tree-view/state.ts";

/**
 * Renders the `div` around a branch's row and its group.
 */
const Branched = withContext("div", "branch");

/**
 * Renders the `div` with the `group` role around a branch's children.
 */
const Grouped = withContext("div", "branchContent");

/**
 * Describes the props of a subtree: the node, its place, the render function and the guide.
 */
export interface SubtreeProps {
  /**
   * Element each group of children renders first, `TreeView.BranchIndentGuide` or nothing.
   */
  readonly indentGuide?: ReactNode;

  /**
   * Positions of the node and of each ancestor among their siblings, from the top.
   */
  readonly indexPath: readonly number[];

  /**
   * The node, as the collection stores it.
   */
  readonly node: unknown;

  /**
   * Returns the node's row.
   */
  readonly render: NodeRender<unknown>;
}

/**
 * Renders a node inside the provider its row's parts read.
 *
 * @param props - The node, its place, the render function and the guide.
 * @returns The node's elements.
 */
export function Subtree({ indentGuide, indexPath, node, render }: SubtreeProps): ReactElement {
  const { api } = useTreeView();
  const placed = { indexPath: [...indexPath], node };
  const nodeState = api.getNodeState(placed);
  const branch: ComponentProps<typeof Branched> = {
    ...api.getBranchProps(placed),
    "aria-busy": undefined,
    "aria-disabled": undefined,
    "aria-expanded": undefined,
    "aria-level": undefined,
    "aria-selected": undefined,
    role: undefined,
  };

  return (
    <NodeProvider value={placed}>
      {nodeState.isBranch ? (
        <Branched {...branch}>
          {render({ indexPath, node, nodeState })}
          {nodeState.expanded ? (
            <Grouped {...api.getBranchContentProps(placed)}>
              {indentGuide}
              {api.collection.getNodeChildren(node).map((child, index) => (
                <Subtree
                  indentGuide={indentGuide}
                  indexPath={[...indexPath, index]}
                  key={api.collection.getNodeValue(child)}
                  node={child}
                  render={render}
                />
              ))}
            </Grouped>
          ) : null}
        </Branched>
      ) : (
        render({ indexPath, node, nodeState })
      )}
    </NodeProvider>
  );
}
