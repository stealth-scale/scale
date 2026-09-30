/**
 * Names each node and edge of a canvas for a screen reader, where the caller gave it no name.
 *
 * @remarks
 *   React Flow renders a node as a focusable `group` named only by the node's `ariaLabel`, and an
 *   edge by its `ariaLabel`, else by English words around the ids of its ends. A node whose data
 *   states a string `label`, as the built-in types' data does, is named by it. An edge is named by
 *   the names of its ends through the canvas's words. A node or an edge that states its own
 *   `ariaLabel` keeps it. While the canvas marks changes, the name of a node or an edge that was
 *   added, changed or removed ends with the change's word, because the card's tag and the edge's
 *   ink are hidden from a screen reader. Each named copy is kept for the object it was made from
 *   while its name is unchanged, so an unchanged node object yields the same copy on every render
 *   and React Flow keeps its measurement.
 */

import { type Edge, type Node } from "@xyflow/react";

import { type OmitUndefined, omitUndefined } from "@stealthscale/hooks";

import { type Diffed, markedEdges, wordOf } from "#graph/diffed.ts";

/**
 * Describes the ends of an edge by their names, which the canvas's words turn into the edge's name.
 */
export interface EdgeEnds {
  /**
   * Name of the node the edge leaves.
   */
  readonly source: string;

  /**
   * Name of the node the edge enters.
   */
  readonly target: string;
}

/**
 * Named copy of each node object, kept while the node's name is unchanged.
 */
const NODES = new WeakMap<Node, Node>();

/**
 * Named copy of each edge object, kept while the edge's name is unchanged.
 */
const EDGES = new WeakMap<Edge, Edge>();

/**
 * Returns the name a node takes: its own `ariaLabel`, else its data's string `label`.
 */
export function nameOf(node: Node): string | undefined {
  const label = node.data["label"];

  return node.ariaLabel ?? (typeof label === "string" ? label : undefined);
}

/**
 * Returns the copy of an element named `name`: the kept copy while its name matches, else a new
 * copy, which replaces it.
 */
function named<T extends Edge | Node>(kept: WeakMap<T, T>, element: T, name: string): T {
  const copy = kept.get(element);

  if (copy?.ariaLabel === name) return copy;

  const made = { ...element, ariaLabel: name };

  kept.set(element, made);

  return made;
}

/**
 * Returns no word, for a node or an edge the canvas marks no change on.
 */
function none(): undefined {
  return undefined;
}

/**
 * Returns the nodes, each without a name of its own named by its data's `label`, and each with a
 * change named with the change's word after its name, else after its id.
 *
 * @typeParam N - One node of the graph.
 * @param nodes - The graph's nodes.
 * @param changeOf - Returns the word of a node's change by its id, or undefined for none.
 */
export function namedNodes<N extends Node>(
  nodes: readonly N[],
  changeOf: (id: string) => string | undefined = none,
): N[] {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The map keeps copies made from nodes of the canvas's own type.
  const kept = NODES as WeakMap<N, N>;

  return nodes.map((node) => {
    const name = nameOf(node);
    const word = changeOf(node.id);

    if (word !== undefined) return named(kept, node, `${name ?? node.id}, ${word}`);

    return node.ariaLabel !== undefined || name === undefined ? node : named(kept, node, name);
  });
}

/**
 * Returns the edges, each without a name of its own named by the names of its ends, and each with a
 * change named with the change's word after its name.
 *
 * @typeParam E - One edge of the graph.
 * @param edges - Links between the nodes.
 * @param nodes - The graph's nodes, whose names name the ends. An end without a name is named by
 *   its id.
 * @param nameEdge - The canvas's words for an edge between two named ends.
 * @param changeOf - Returns the word of an edge's change by its id, or undefined for none.
 */
export function namedEdges<E extends Edge>(
  edges: readonly E[],
  nodes: readonly Node[],
  nameEdge: (ends: EdgeEnds) => string,
  changeOf: (id: string) => string | undefined = none,
): E[] {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The map keeps copies made from edges of the canvas's own type.
  const kept = EDGES as WeakMap<E, E>;
  const names = new Map(nodes.map((node) => [node.id, nameOf(node)]));

  return edges.map((edge) => {
    const word = changeOf(edge.id);

    if (edge.ariaLabel !== undefined && word === undefined) return edge;

    const name =
      edge.ariaLabel ??
      nameEdge({
        source: names.get(edge.source) ?? edge.source,
        target: names.get(edge.target) ?? edge.target,
      });

    return named(kept, edge, word === undefined ? name : `${name}, ${word}`);
  });
}

/**
 * Returns the function that reads the word of a node's or an edge's change, or no word while the
 * canvas marks no change.
 */
function changesOf(
  diffed: Diffed | undefined,
  kind: "edges" | "nodes",
): (id: string) => string | undefined {
  return diffed === undefined ? none : (id) => wordOf(diffed[kind].get(id), diffed.words);
}

/**
 * Describes the graph a canvas renders: its nodes and its edges, either of which may be absent.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 */
export interface Graph<N extends Node, E extends Edge> {
  /**
   * Links between the nodes.
   */
  readonly edges?: E[] | undefined;

  /**
   * Nodes of the graph.
   */
  readonly nodes?: N[] | undefined;
}

/**
 * Returns the edges named, and each marked with its change while the canvas marks changes.
 */
function edgesOf<E extends Edge>(
  edges: readonly E[],
  nodes: readonly Node[],
  nameEdge: (ends: EdgeEnds) => string,
  diffed: Diffed | undefined,
): E[] {
  const labelled = namedEdges(edges, nodes, nameEdge, changesOf(diffed, "edges"));

  return diffed === undefined ? labelled : markedEdges(labelled, diffed);
}

/**
 * Returns the graph with its nodes and edges named, leaving out what the graph leaves out.
 *
 * @typeParam N - One node of the graph.
 * @typeParam E - One edge of the graph.
 * @param graph - The nodes and the edges, either of which may be absent.
 * @param nameEdge - The canvas's words for an edge between two named ends.
 * @param diffed - The changes the canvas marks, or undefined for none.
 */
export function namedGraph<N extends Node, E extends Edge>(
  { edges, nodes }: Graph<N, E>,
  nameEdge: (ends: EdgeEnds) => string,
  diffed?: Diffed,
): OmitUndefined<Graph<N, E>> {
  return omitUndefined({
    edges: edges === undefined ? undefined : edgesOf(edges, nodes ?? [], nameEdge, diffed),
    nodes: nodes === undefined ? undefined : namedNodes(nodes, changesOf(diffed, "nodes")),
  });
}
