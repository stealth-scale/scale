/**
 * Shares a comparison's changes with a canvas's nodes, names the changes, and marks each edge with
 * its change for the recipe.
 *
 * @remarks
 *   A canvas given `changes` provides each node's change by its id and the words of the changes. A
 *   node's card reads its own through React Flow's node id: a changed, added or removed card takes
 *   the change as its tag, and an unchanged card recedes. An edge takes `data-change` on React
 *   Flow's element, which the recipe reads. A node or an edge the comparison does not list, and
 *   every node and edge of a canvas without `changes`, is marked by nothing. Each marked copy of an
 *   edge is kept for the edge it was made from while its change is the same, so an unchanged edge
 *   yields the same copy on every render.
 */

import { createContext, use } from "react";

import { type Edge, useNodeId } from "@xyflow/react";

import { type GraphChangeType, type GraphDiff } from "#diff/diff.ts";

/**
 * Describes the words of the changes a canvas marks, each with an English default.
 */
export interface ChangeWords {
  /**
   * Word of an added node or edge. `Added` unless stated.
   */
  readonly addedLabel?: string | undefined;

  /**
   * Word of a changed node. `Changed` unless stated.
   */
  readonly changedLabel?: string | undefined;

  /**
   * Word of a removed node or edge. `Removed` unless stated.
   */
  readonly removedLabel?: string | undefined;
}

/**
 * Describes the props a canvas marks changes by: a comparison and the words of its changes.
 */
export interface CanvasChanges extends ChangeWords {
  /**
   * Comparison whose changes the canvas marks, such as `diffGraphs(before, after)`.
   */
  readonly changes?: GraphDiff | undefined;
}

/**
 * Describes the changes a canvas marks: each node's and each edge's by id, and their words.
 */
export interface Diffed {
  /**
   * Change of each edge the comparison lists, by the edge's id.
   */
  readonly edges: ReadonlyMap<string, GraphChangeType>;

  /**
   * Change of each node the comparison lists, by the node's id.
   */
  readonly nodes: ReadonlyMap<string, GraphChangeType>;

  /**
   * Words of the changes.
   */
  readonly words: ChangeWords;
}

/**
 * Describes a node's change with the word it is marked by.
 */
export interface NodeChange {
  /**
   * Kind of change the node went through.
   */
  readonly change: GraphChangeType;

  /**
   * Word of the change, or undefined for an unchanged node.
   */
  readonly word: string | undefined;
}

/**
 * Describes the data attribute that marks an edge with its change.
 */
interface ChangeAttributes {
  /**
   * Kind of change the edge went through.
   */
  readonly "data-change": GraphChangeType;
}

/**
 * Provides the changes a canvas marks, or undefined while it marks none.
 */
export const DiffContext = createContext<Diffed | undefined>(undefined);

/**
 * Describes an edge's marked copy with the change it was marked with.
 *
 * @typeParam E - One edge of the graph.
 */
interface Copy<E extends Edge> {
  /**
   * Change the copy was marked with.
   */
  readonly change: GraphChangeType;

  /**
   * The marked copy.
   */
  readonly copy: E;
}

/**
 * Marked copy of each edge object, kept while the edge's change is the same.
 */
const MARKED = new WeakMap<Edge, Copy<Edge>>();

/**
 * Returns the word a change is marked by, or undefined for no change.
 */
export function wordOf(
  change: GraphChangeType | undefined,
  words: ChangeWords,
): string | undefined {
  if (change === "added") return words.addedLabel ?? "Added";
  if (change === "changed") return words.changedLabel ?? "Changed";

  return change === "removed" ? (words.removedLabel ?? "Removed") : undefined;
}

/**
 * Returns the changes a canvas marks from its comparison and words, or undefined without a
 * comparison.
 */
export function diffedOf(changes: GraphDiff | undefined, words: ChangeWords): Diffed | undefined {
  if (changes === undefined) return undefined;

  return {
    edges: new Map(changes.edges.map(({ change, id }) => [id, change])),
    nodes: new Map(changes.nodes.map(({ change, id }) => [id, change])),
    words,
  };
}

/**
 * Returns the copy of an edge marked with a change: the kept copy while its change matches, else a
 * new copy, which replaces it.
 */
function marked<E extends Edge>(kept: WeakMap<E, Copy<E>>, edge: E, change: GraphChangeType): E {
  const known = kept.get(edge);

  if (known?.change === change) return known.copy;

  const attributes: ChangeAttributes & NonNullable<Edge["domAttributes"]> = {
    ...edge.domAttributes,
    "data-change": change,
  };
  const copy = { ...edge, domAttributes: attributes };

  kept.set(edge, { change, copy });

  return copy;
}

/**
 * Returns the edges, each the comparison lists marked with its change.
 *
 * @typeParam E - One edge of the graph.
 */
export function markedEdges<E extends Edge>(edges: readonly E[], diffed: Diffed): E[] {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The map keeps copies made from edges of the canvas's own type.
  const kept = MARKED as WeakMap<E, Copy<E>>;

  return edges.map((edge) => {
    const change = diffed.edges.get(edge.id);

    return change === undefined ? edge : marked(kept, edge, change);
  });
}

/**
 * Returns the change of the node a card renders for, or undefined outside a canvas that marks
 * changes and for a node the comparison does not list.
 */
export function useNodeChange(): NodeChange | undefined {
  const id = useNodeId();
  const diffed = use(DiffContext);

  if (id === null || diffed === undefined) return undefined;

  const change = diffed.nodes.get(id);

  return change === undefined ? undefined : { change, word: wordOf(change, diffed.words) };
}
