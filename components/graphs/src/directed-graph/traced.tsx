/**
 * Renders a directed graph's canvas, and its readout with the overview map at the row's end.
 *
 * @remarks
 *   A press on a node, Enter or Space focuses it, and Escape, a press on the canvas's background or
 *   the readout's control clears the focus. Nodes cannot be dragged, connected or removed. One node
 *   at most is selected, because a modifier key does not add a second node and Shift starts no
 *   selection box. Edges are no tab stops, and a press on one changes nothing. The canvas renders
 *   inside `Graph.Root`, because it fits the view through React Flow's store, which the root
 *   provides.
 */

import { type ReactElement } from "react";

import { type NodeTypes } from "@xyflow/react";

import { Card } from "#directed-graph/card.tsx";
import { BranchProvider, type TracedProps, useTraced } from "#directed-graph/state.ts";
import { type CardNode } from "#directed-graph/view.ts";
import { Canvas } from "#graph/canvas.tsx";
import { usePlaced } from "#graph/placed.ts";
import { Readout } from "#graph/readout.tsx";

/**
 * Maps the directed graph's node type to its card.
 */
const NODE_TYPES: NodeTypes = { directed: Card };

/**
 * Renders the canvas over the graph's view and the readout below it.
 *
 * @param props - The graph, its focus and branches, its words and its direction.
 */
export function Traced(props: TracedProps): ReactElement {
  const { clear, onNodesChange, toggle, view } = useTraced(props);
  const placing = usePlaced(view.nodes, view.complete);
  const { counts } = view;
  const { words } = props;

  return (
    <BranchProvider value={toggle}>
      <Canvas<CardNode>
        data-placing={placing ? "" : undefined}
        edges={view.edges}
        edgesFocusable={false}
        label={props.label}
        multiSelectionKeyCode={null}
        nodeDescription={words.nodeDescription}
        nodes={view.nodes}
        nodesConnectable={false}
        nodesDraggable={false}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        selectionKeyCode={null}
      />
      <Readout
        clearLabel={words.clearLabel}
        focused={counts !== undefined}
        onClear={clear}
        text={counts === undefined ? words.promptLabel : words.summary(counts)}
      >
        {props.overview}
      </Readout>
    </BranchProvider>
  );
}
