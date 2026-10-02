/**
 * Turns React Flow's changes into whole graphs for a caller's history: a connection, a move that
 * ends and a removal each arrive once, as the graph after the edit and a step that names it.
 *
 * @remarks
 *   A drag reports a node's position on every frame and a last position with `dragging` false, and
 *   an arrow key reports one position with `dragging` false, so a move arrives once, where it ends.
 *   A removal by Delete, Backspace or an edge's remove control arrives once with every node and
 *   edge it removed, and a removed node takes its edges with it. A connection that repeats an edge
 *   the graph has already adds nothing and arrives as nothing. A selection and a measurement are no
 *   edits. The caller's own `onConnect`, `onDelete` and `onNodesChange` run first, so a caller that
 *   applies React Flow's changes keeps doing so.
 */

import {
  addEdge,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type NodePositionChange,
  type OnConnect,
  type OnDelete,
  type OnNodesChange,
  type XYPosition,
} from "@xyflow/react";

import { type DropTarget, useDrop } from "#graph/drop.ts";

/**
 * Describes the kind of edit a step records.
 */
export type GraphStepType = "connect" | "move" | "remove";

/**
 * Describes one edit to a graph: its kind and the nodes and edges it touched.
 */
export interface GraphStep {
  /**
   * Ids of the edges the edit connected or removed.
   */
  readonly edges: readonly string[];

  /**
   * Ids of the nodes the edit moved or removed.
   */
  readonly nodes: readonly string[];

  /**
   * Kind of the edit.
   */
  readonly type: GraphStepType;
}

/**
 * Describes a graph after an edit.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export interface GraphEdit<N extends Node, E extends Edge> {
  /**
   * Edges of the graph after the edit.
   */
  readonly edges: E[];

  /**
   * Nodes of the graph after the edit.
   */
  readonly nodes: N[];
}

/**
 * Describes what the handlers are made from: the graph, the caller's handlers and the channel the
 * edits arrive through.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export interface EditingInput<N extends Node, E extends Edge> {
  /**
   * Edges of the graph as the canvas renders them.
   */
  readonly edges: E[];

  /**
   * Nodes of the graph as the canvas renders them.
   */
  readonly nodes: N[];

  /**
   * Caller's handler of a connection.
   */
  readonly onConnect?: OnConnect | undefined;

  /**
   * Caller's handler of a removal.
   */
  readonly onDelete?: OnDelete<N, E> | undefined;

  /**
   * Channel every edit arrives through, as the graph after it and a step.
   */
  readonly onGraphChange: (graph: GraphEdit<N, E>, step: GraphStep) => void;

  /**
   * Caller's handler of React Flow's node changes.
   */
  readonly onNodesChange?: OnNodesChange<N> | undefined;
}

/**
 * Describes the handlers a canvas gives React Flow while it reports edits.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export interface Editing<N extends Node, E extends Edge> {
  /**
   * Reports a connection as a `connect` step.
   */
  readonly onConnect: OnConnect;

  /**
   * Reports a removal as a `remove` step.
   */
  readonly onDelete: OnDelete<N, E>;

  /**
   * Reports the end of a move as a `move` step.
   */
  readonly onNodesChange: OnNodesChange<N>;
}

/**
 * Describes the props a canvas reports edits and drops through.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export interface CanvasEdits<N extends Node, E extends Edge> {
  /**
   * Called with a palette item's id and the point in the graph a person dropped it at.
   */
  readonly onDropItem?: ((item: string, position: XYPosition) => void) | undefined;

  /**
   * Channel every edit on the canvas arrives through, as the graph after it and a step, while the
   * canvas's `nodes` and `edges` are the caller's.
   */
  readonly onGraphChange?: ((graph: GraphEdit<N, E>, step: GraphStep) => void) | undefined;
}

/**
 * Describes what a canvas's edit handlers are made from: its graph, its caller's handlers, and
 * the channels its edits and drops arrive through.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export interface EditsInput<N extends Node, E extends Edge>
  extends CanvasEdits<N, E>, Pick<EditingInput<N, E>, "onConnect" | "onDelete" | "onNodesChange"> {
  /**
   * Edges of the graph, or undefined for none.
   */
  readonly edges?: E[] | undefined;

  /**
   * Nodes of the graph, or undefined for none.
   */
  readonly nodes?: N[] | undefined;
}

/**
 * Returns the positions a move ended at, or no change while no move ended.
 */
function endsOf<N extends Node>(changes: ReadonlyArray<NodeChange<N>>): NodePositionChange[] {
  return changes.filter(
    (change): change is NodePositionChange =>
      change.type === "position" && change.dragging === false,
  );
}

/**
 * Returns the handlers that report each edit through `onGraphChange` after the caller's own.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export function editingOf<N extends Node, E extends Edge>(
  input: EditingInput<N, E>,
): Editing<N, E> {
  const { edges, nodes, onGraphChange } = input;

  return {
    onConnect: (connection: Connection) => {
      input.onConnect?.(connection);

      const next = addEdge(connection, edges);
      const added = next.filter((edge) => !edges.includes(edge)).map(({ id }) => id);

      if (added.length > 0)
        onGraphChange({ edges: next, nodes }, { edges: added, nodes: [], type: "connect" });
    },
    onDelete: (removed) => {
      input.onDelete?.(removed);

      const [nodeIds, edgeIds] = [
        new Set(removed.nodes.map(({ id }) => id)),
        new Set(removed.edges.map(({ id }) => id)),
      ];
      const graph = {
        edges: edges.filter(({ id }) => !edgeIds.has(id)),
        nodes: nodes.filter(({ id }) => !nodeIds.has(id)),
      };

      onGraphChange(graph, { edges: [...edgeIds], nodes: [...nodeIds], type: "remove" });
    },
    onNodesChange: (changes) => {
      input.onNodesChange?.(changes);

      const ends = endsOf(changes);

      if (ends.length > 0) {
        onGraphChange(
          { edges, nodes: applyNodeChanges(ends, nodes) },
          { edges: [], nodes: ends.map(({ id }) => id), type: "move" },
        );
      }
    },
  };
}

/**
 * Returns the handlers a canvas gives React Flow for its edits and drops: the drop target, and the
 * edit handlers while the caller takes edits through `onGraphChange`.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export function useEdits<N extends Node, E extends Edge>(
  input: EditsInput<N, E>,
): DropTarget & Partial<Editing<N, E>> {
  const drop = useDrop(input.onDropItem);
  const { onGraphChange } = input;

  if (onGraphChange === undefined) return drop;

  const graph = { edges: input.edges ?? [], nodes: input.nodes ?? [] };

  return { ...drop, ...editingOf({ ...input, ...graph, onGraphChange }) };
}
