/**
 * Renders a directed graph's card: the node's name, kind, icon, status and detail, its relation to
 * the focused node, and the control that opens and closes its branch.
 *
 * @remarks
 *   The card is `Graph.Node`. The relation is the data package's `Badge` on the card's top edge,
 *   hidden from assistive technology because the node's accessible name ends with the same word.
 *   The branch control is the actions `Button` on the middle of the side the node's edges leave,
 *   with `aria-expanded` and the number of nodes a press hides or shows. A press on the control
 *   does not select the node, and React Flow ignores a key pressed on it, so Enter and Space open
 *   or close the branch without changing the focus.
 */

import { type ReactElement } from "react";

import { type NodeProps } from "@xyflow/react";

import { Button } from "@stealthscale/component-actions";
import { Badge } from "@stealthscale/component-data";

import { useToggle } from "#directed-graph/state.ts";
import { type CardNode } from "#directed-graph/view.ts";
import { Node } from "#graph/node.tsx";

/**
 * Renders the node's card from its data.
 *
 * @param props - React Flow's node props: the node's id and its data among them.
 */
export function Card({ data, id }: NodeProps<CardNode>): ReactElement {
  const toggle = useToggle();
  const { branch, tag } = data;

  return (
    <Node
      branch={
        branch === undefined ? undefined : (
          <Button
            aria-expanded={branch.expanded}
            className="nokey nodrag nopan"
            onClick={(event) => {
              event.stopPropagation();
              toggle(id);
            }}
            palette="neutral"
            size="xs"
            variant="surface"
          >
            {branch.label}
          </Button>
        )
      }
      dimmed={data.dimmed}
      icon={data.icon}
      inputs={data.inputs}
      outputs={data.outputs}
      status={data.status}
      subtitle={data.kind}
      tag={
        tag === undefined ? undefined : (
          <Badge aria-hidden palette="neutral" size="sm" variant="surface">
            {tag}
          </Badge>
        )
      }
      title={data.label}
    >
      {data.detail}
    </Node>
  );
}
