/**
 * Provides the state the parts share beside the machine: whether a label is mounted, and the node
 * a row's parts belong to.
 *
 * @remarks
 *   The tree names itself after `TreeView.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. `TreeView.Nodes` provides each node and
 *   its index path to the parts it renders for that node.
 */

import { type NodeProps } from "@zag-js/tree-view";

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("TreeView");

/**
 * Provides a node and its index path to the parts of its row, and reads them back.
 *
 * @remarks
 *   `useNode` throws for a row part rendered outside `TreeView.Nodes`.
 */
export const [NodeProvider, useNode] = createRequiredContext<NodeProps>("TreeView.Nodes");
