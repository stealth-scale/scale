/**
 * Fixtures for the tree view specs: a collection of files with a nested branch and a disabled item,
 * and a tree that renders every part of a row.
 */

import { type ReactElement } from "react";

import { TreeCollection } from "@zag-js/collection";

import { BranchControl } from "#tree-view/branch-control.tsx";
import { BranchIndentGuide } from "#tree-view/branch-indent-guide.tsx";
import { BranchIndicator } from "#tree-view/branch-indicator.tsx";
import { BranchText } from "#tree-view/branch-text.tsx";
import { BranchTrigger } from "#tree-view/branch-trigger.tsx";
import { type NodeDetails } from "#tree-view/details.ts";
import { ItemIndicator } from "#tree-view/item-indicator.tsx";
import { ItemText } from "#tree-view/item-text.tsx";
import { Item } from "#tree-view/item.tsx";
import { Label } from "#tree-view/label.tsx";
import { NodeCheckbox } from "#tree-view/node-checkbox.tsx";
import { NodeRenameInput } from "#tree-view/node-rename-input.tsx";
import { Nodes } from "#tree-view/nodes.tsx";
import { Root, type RootProps } from "#tree-view/root.tsx";
import { Tree } from "#tree-view/tree.tsx";

/**
 * Describes a node of the fixture's collection.
 */
export interface FileNode {
  /**
   * Nodes under a branch.
   */
  readonly children?: readonly FileNode[];

  /**
   * Number of children a branch loads on demand.
   */
  readonly childrenCount?: number;

  /**
   * Whether the node takes no selection.
   */
  readonly disabled?: boolean;

  /**
   * Value of the node and its text.
   */
  readonly value: string;
}

/**
 * Returns a collection over the fixture's files: `src` with `app.ts` and `lib` with `util.ts`,
 * then `readme.md` and the disabled `locked.md`.
 *
 * @returns The collection.
 */
export function files(): TreeCollection<FileNode> {
  return new TreeCollection<FileNode>({
    nodeToString: (node) => node.value,
    nodeToValue: (node) => node.value,
    rootNode: {
      children: [
        {
          children: [{ value: "app.ts" }, { children: [{ value: "util.ts" }], value: "lib" }],
          value: "src",
        },
        { value: "readme.md" },
        { disabled: true, value: "locked.md" },
      ],
      value: "root",
    },
  });
}

/**
 * Renders a node's row with every part: a trigger around the indicator, a checkbox, the text, the
 * rename input and, for an item, the indicator.
 *
 * @param details - The node and its state.
 * @returns The row.
 */
export function row({ node, nodeState }: NodeDetails<FileNode>): ReactElement {
  return nodeState.isBranch ? (
    <BranchControl>
      <BranchTrigger>
        <BranchIndicator>›</BranchIndicator>
      </BranchTrigger>
      <NodeCheckbox>✓</NodeCheckbox>
      <BranchText>{node.value}</BranchText>
      <NodeRenameInput />
    </BranchControl>
  ) : (
    <Item>
      <NodeCheckbox>✓</NodeCheckbox>
      <ItemText>{node.value}</ItemText>
      <ItemIndicator>•</ItemIndicator>
      <NodeRenameInput />
    </Item>
  );
}

/**
 * Renders a tree over the fixture's files with the props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @param labelled - Whether the tree renders `TreeView.Label`.
 * @returns The tree.
 */
export function composed(props: Partial<RootProps> = {}, labelled = true): ReactElement {
  return (
    <Root collection={files()} {...props}>
      {labelled ? <Label>Files</Label> : null}
      <Tree aria-label={labelled ? undefined : "Project files"}>
        <Nodes indentGuide={<BranchIndentGuide />} render={row} />
      </Tree>
    </Root>
  );
}
