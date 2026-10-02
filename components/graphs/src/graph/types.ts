/**
 * Maps React Flow's node and edge types to the kit's components.
 *
 * @remarks
 *   The canvas renders these unless the caller passes its own maps. A caller that adds a type
 *   spreads the kit's map into its own, so the built-in types still render as the kit's.
 */

import { type EdgeTypes, type NodeTypes } from "@xyflow/react";

import { Edge } from "#graph/edge.tsx";
import { LabelNode } from "#graph/label-node.tsx";

/**
 * Maps React Flow's `default`, `input` and `output` node types to the kit's node.
 */
export const NODE_TYPES: NodeTypes = { default: LabelNode, input: LabelNode, output: LabelNode };

/**
 * Maps React Flow's `default` edge type to the kit's edge.
 */
export const EDGE_TYPES: EdgeTypes = { default: Edge };
