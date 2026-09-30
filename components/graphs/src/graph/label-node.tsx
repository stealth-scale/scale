/**
 * Renders the kit's node for React Flow's `default`, `input` and `output` types from the node's
 * data.
 *
 * @remarks
 *   React Flow's own nodes are a bare box with a handle on each side. The kit renders `Graph.Node`
 *   for the three built-in types instead, so a graph that declares no node type still looks like
 *   the theme. The types differ in their ports: an `input` node has no port edges enter, an
 *   `output` node no port edges leave, and a `default` node one of each, named `In` and `Out`
 *   unless the data states its own ports.
 */

import { type ReactElement, type ReactNode } from "react";

import { type Node as FlowNode, type NodeProps } from "@xyflow/react";

import { omitUndefined } from "@stealthscale/hooks";

import { type GraphStatus, Node } from "#graph/node.tsx";
import { type GraphPort } from "#graph/ports.tsx";

/**
 * Port edges enter, unless the data states the node's inputs.
 */
const INPUTS: readonly GraphPort[] = [{ id: "in", label: "In" }];

/**
 * Port edges leave, unless the data states the node's outputs.
 */
const OUTPUTS: readonly GraphPort[] = [{ id: "out", label: "Out" }];

/**
 * Describes the data of a node of a built-in type: its words, its ports and its states.
 */
export interface LabelNodeData extends Record<string, unknown> {
  /**
   * Line in the card's body.
   */
  readonly detail?: string | undefined;

  /**
   * Glyph before the title, from the caller.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Ports edges enter. `In` unless stated, and none on an `input` node.
   */
  readonly inputs?: readonly GraphPort[] | undefined;

  /**
   * Whether the node is misconfigured.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Title of the node.
   */
  readonly label: string;

  /**
   * Ports edges leave. `Out` unless stated, and none on an `output` node.
   */
  readonly outputs?: readonly GraphPort[] | undefined;

  /**
   * Fault of an invalid node in one line.
   */
  readonly problem?: string | undefined;

  /**
   * Status of the node.
   */
  readonly status?: GraphStatus | undefined;

  /**
   * Line under the title.
   */
  readonly subtitle?: string | undefined;
}

/**
 * Describes a node of a built-in type.
 */
export type LabelNodeType = FlowNode<LabelNodeData, "default" | "input" | "output">;

/**
 * Renders the card of a built-in node from its data, with the ports its type has.
 *
 * @param props - React Flow's node props: its data and its type among them.
 */
export function LabelNode({ data, type }: NodeProps<LabelNodeType>): ReactElement {
  const inputs = data.inputs ?? (type === "input" ? [] : INPUTS);
  const outputs = data.outputs ?? (type === "output" ? [] : OUTPUTS);

  return (
    <Node
      inputs={inputs}
      outputs={outputs}
      title={data.label}
      {...omitUndefined({
        icon: data.icon,
        invalid: data.invalid,
        problem: data.problem,
        status: data.status,
        subtitle: data.subtitle,
      })}
    >
      {data.detail}
    </Node>
  );
}
