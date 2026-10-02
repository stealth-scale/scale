/**
 * Renders a graph's canvas: React Flow inside a panel as tall as the figure's ratio, with the kit's
 * nodes and edges, the dotted background, and the words a screen reader hears.
 *
 * @remarks
 *   The canvas is controlled. `nodes` and `edges` are what it renders. React Flow passes every
 *   change a person makes to the change handlers, where the caller applies it with React Flow's
 *   `applyNodeChanges` and `applyEdgeChanges`. React Flow reports each node's measured size through
 *   `onNodesChange` too, so a caller that drops those changes leaves its nodes unmeasured. A caller
 *   that keeps a history takes each finished edit through `onGraphChange` as the graph after it and
 *   a step, and a palette item's drop through `onDropItem`. Delete and Backspace remove the
 *   selection. `readOnly` keeps panning, zooming and each node's tab stop, and turns off selecting,
 *   dragging, connecting and the keys that move and remove. Each node is named by its data's
 *   `label` and each edge by the names of its ends, unless it states its own `ariaLabel`. The view
 *   fits the graph on the first render with 24px to spare at either side and 32px at the top and
 *   the bottom, for a tag above a card and for the attribution in the bottom-start corner. A canvas
 *   given `changes` marks each node and edge the comparison lists: a card takes its change as its
 *   tag or recedes while unchanged, an edge takes its change's ink, and each name ends with the
 *   change's word. React Flow's application element is named by `label`, and every other prop goes
 *   to React Flow.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  Background,
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlow,
  type ReactFlowProps,
} from "@xyflow/react";

import { withContext } from "#graph/context.ts";
import { type CanvasChanges, DiffContext, diffedOf } from "#graph/diffed.ts";
import { type CanvasEdits, useEdits } from "#graph/editing.ts";
import { namedGraph } from "#graph/names.ts";
import { settingsOf } from "#graph/settings.ts";
import { RemovalContext } from "#graph/state.ts";
import { type CanvasWords, edgeNameOf, removeNameOf } from "#graph/words.ts";

/**
 * Renders the canvas's box with the recipe's canvas class.
 */
const Box = withContext("div", "canvas");

/**
 * Describes the props of the canvas: the graph, its name, its mode, its words, its edits, and
 * React Flow's props.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export interface CanvasProps<N extends FlowNode = FlowNode, E extends FlowEdge = FlowEdge>
  extends
    CanvasChanges,
    CanvasEdits<N, E>,
    CanvasWords,
    Omit<
      ReactFlowProps<N, E>,
      "aria-label" | "ariaLabelConfig" | "children" | "className" | "colorMode" | "style"
    > {
  /**
   * Whether the canvas renders its dotted background. On unless stated.
   */
  readonly background?: boolean | undefined;

  /**
   * Elements React Flow renders over the canvas, such as a panel of the caller's. The kit's
   * controls and overview map go beside the canvas, in `Graph.Root`.
   */
  readonly children?: ReactNode | undefined;

  /**
   * Accessible name of the canvas.
   */
  readonly label: string;

  /**
   * Whether the canvas is read and not edited.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Glyph of every edge's remove control, from the caller. No remove control renders without one.
   */
  readonly removeGlyph?: ReactNode | undefined;
}

/**
 * Renders React Flow in the canvas's box with the kit's types, words, names, switches and edits.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 * @param props - The graph, its name, its mode, its words, its edits, and React Flow's props.
 */
export function Canvas<N extends FlowNode = FlowNode, E extends FlowEdge = FlowEdge>(
  props: CanvasProps<N, E>,
): ReactElement {
  const {
    addedLabel,
    background = true,
    changedLabel,
    changes,
    children,
    edgeDescription,
    edgeName = edgeNameOf,
    edges,
    label,
    moveAnnouncement,
    nodeDescription,
    nodes,
    onDropItem,
    onGraphChange,
    readOnly = false,
    removedLabel,
    removeGlyph,
    removeName = removeNameOf,
    ...flow
  } = props;
  const diffed = diffedOf(changes, { addedLabel, changedLabel, removedLabel });
  const edits = useEdits({ ...flow, edges, nodes, onDropItem, onGraphChange });

  return (
    <RemovalContext value={{ editable: !readOnly, glyph: removeGlyph, name: removeName }}>
      <DiffContext value={diffed}>
        <Box>
          <ReactFlow
            aria-label={label}
            {...settingsOf(readOnly, { edgeDescription, moveAnnouncement, nodeDescription })}
            {...flow}
            {...edits}
            {...namedGraph({ edges, nodes }, edgeName, diffed)}
          >
            {background ? <Background /> : null}
            {children}
          </ReactFlow>
        </Box>
      </DiffContext>
    </RemovalContext>
  );
}
