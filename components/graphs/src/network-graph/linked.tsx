/**
 * Renders a network graph's canvas, and its readout with the overview map at the row's end.
 *
 * @remarks
 *   A press on a node, Enter or Space focuses it, and Escape, a press on the canvas's background or
 *   the readout's control clears the focus. While nodes can be dragged, a drag or an arrow key
 *   moves the focused node, and the view does not move. Nodes cannot be connected or removed.
 *   One node at most is selected, because a modifier key does not add a second node and Shift
 *   starts no selection box. Links are no tab stops. The canvas renders inside `Graph.Root`,
 *   because it fits the view through React Flow's store, which the root provides.
 */

import { type ReactElement } from "react";

import { type NodeTypes } from "@xyflow/react";

import { Canvas } from "#graph/canvas.tsx";
import { usePlaced } from "#graph/placed.ts";
import { Readout } from "#graph/readout.tsx";
import { Disc } from "#network-graph/disc.tsx";
import { type LinkedProps, useLinked } from "#network-graph/state.ts";
import { type DiscNode } from "#network-graph/view.ts";

/**
 * Maps the network's node type to its disc.
 */
const NODE_TYPES: NodeTypes = { disc: Disc };

/**
 * Renders the canvas over the network's view and the readout below it.
 *
 * @param props - The graph, its focus, its layout and its words.
 */
export function Linked(props: LinkedProps): ReactElement {
  const { clear, moved, nodes, onNodesChange, view } = useLinked(props);
  const placing = usePlaced(view.nodes, view.complete, moved);
  const { connections } = view;
  const { words } = props;

  return (
    <>
      <Canvas<DiscNode>
        data-placing={placing ? "" : undefined}
        edges={view.edges}
        edgesFocusable={false}
        label={props.label}
        moveAnnouncement={words.moveAnnouncement}
        multiSelectionKeyCode={null}
        nodeDescription={words.nodeDescription}
        nodes={nodes}
        nodesConnectable={false}
        nodesDraggable={props.draggable}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        selectionKeyCode={null}
      />
      <Readout
        clearLabel={words.clearLabel}
        focused={connections !== undefined}
        onClear={clear}
        text={connections === undefined ? words.promptLabel : words.summary(connections)}
      >
        {props.overview}
      </Readout>
    </>
  );
}
