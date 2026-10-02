/**
 * Compares two versions of a graph: the nodes and edges the later version adds, changes or removes.
 *
 * @remarks
 *   A node is the same node in both versions while its id is the same, and it is changed while a
 *   field of its `data` differs. Each field is compared by its JSON with object keys sorted, so a
 *   node that only moved, or whose data lists its keys in another order, is unchanged. A React
 *   element in the data, such as an icon, is compared by its component and its props. An edge is
 *   the same edge in both versions while it joins the same ports of the same nodes, so an edge is
 *   added or removed, never changed. The entries follow the later version's order, and the removed
 *   ones follow in the earlier version's order.
 */

import { isValidElement } from "react";

import { type Edge, type Node } from "@xyflow/react";

import { type EdgeEnds } from "#graph/names.ts";
import { edgeNameOf } from "#graph/words.ts";

/**
 * Describes what happened to a node or an edge between two versions.
 */
export type GraphChangeType = "added" | "changed" | "removed" | "unchanged";

/**
 * Describes one node or edge of a comparison: what happened to it, and what it is called.
 */
export interface GraphChange {
  /**
   * Kind of change the node or the edge went through.
   */
  readonly change: GraphChangeType;

  /**
   * Fields of a changed node's data that differ, sorted. Empty for anything else.
   */
  readonly fields: readonly string[];

  /**
   * Id of the node or the edge in the version it is in, the later one where it is in both.
   */
  readonly id: string;

  /**
   * Name of the node, or the edge's name from the names of its ends.
   */
  readonly label: string;
}

/**
 * Describes a comparison of two versions of a graph, node by node and edge by edge.
 */
export interface GraphDiff {
  /**
   * Every edge of either version.
   */
  readonly edges: readonly GraphChange[];

  /**
   * Every node of either version.
   */
  readonly nodes: readonly GraphChange[];
}

/**
 * Describes one version of a graph: its nodes and its edges.
 */
export interface GraphVersion {
  /**
   * Edges of the version.
   */
  readonly edges: readonly Edge[];

  /**
   * Nodes of the version.
   */
  readonly nodes: readonly Node[];
}

/**
 * Returns a function that writes a value's JSON with object keys sorted and each React element as
 * its component's number of first sight and its props.
 */
function canonicalOf(): (value: unknown) => string {
  const components = new Map<unknown, number>();

  /**
   * Replaces a React element and an object with the forms the comparison reads.
   */
  const replacer = (_key: string, value: unknown): unknown => {
    if (isValidElement(value)) {
      if (!components.has(value.type)) components.set(value.type, components.size);

      return { component: components.get(value.type), props: value.props };
    }

    if (value === null || typeof value !== "object" || Array.isArray(value)) return value;

    const fields = new Map(Object.entries(value));

    return Object.fromEntries([...fields.keys()].toSorted().map((key) => [key, fields.get(key)]));
  };

  return (value) => JSON.stringify(value, replacer) ?? "";
}

/**
 * Returns a node's name: its data's string `label`, else its id.
 */
function labelOf(node: Node): string {
  const label = node.data["label"];

  return typeof label === "string" ? label : node.id;
}

/**
 * Returns the fields of two versions of a node's data that differ, sorted.
 */
function fieldsOf(
  before: Node["data"],
  after: Node["data"],
  canonical: (value: unknown) => string,
): string[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

  return [...keys].filter((key) => canonical(before[key]) !== canonical(after[key])).toSorted();
}

/**
 * Returns a node's entry with the fields of its data that differ.
 */
function nodeEntryOf(node: Node, change: GraphChangeType, fields: string[] = []): GraphChange {
  return { change, fields, id: node.id, label: labelOf(node) };
}

/**
 * Returns an entry for every node of either version.
 */
function nodesOf(before: GraphVersion, after: GraphVersion): GraphChange[] {
  const canonical = canonicalOf();
  const earlier = new Map(before.nodes.map((node) => [node.id, node]));
  const later = new Set(after.nodes.map((node) => node.id));
  const kept = after.nodes.map((node) => {
    const previous = earlier.get(node.id);

    if (previous === undefined) return nodeEntryOf(node, "added");

    const fields = fieldsOf(previous.data, node.data, canonical);

    return nodeEntryOf(node, fields.length > 0 ? "changed" : "unchanged", fields);
  });
  const gone = before.nodes.filter((node) => !later.has(node.id));

  return [...kept, ...gone.map((node) => nodeEntryOf(node, "removed"))];
}

/**
 * Returns the name of each node of a version by its id.
 */
function namesOf(version: GraphVersion): Map<string, string> {
  return new Map(version.nodes.map((node) => [node.id, labelOf(node)]));
}

/**
 * Returns the key an edge is the same edge by: its ends and its ports.
 */
function keyOf(edge: Edge): string {
  return JSON.stringify([
    edge.source,
    edge.sourceHandle ?? null,
    edge.target,
    edge.targetHandle ?? null,
  ]);
}

/**
 * Returns an entry for every edge of either version, each named from the names of its ends in the
 * version it is in.
 */
function edgesOf(
  before: GraphVersion,
  after: GraphVersion,
  edgeName: (ends: EdgeEnds) => string,
): GraphChange[] {
  const earlier = new Set(before.edges.map(keyOf));
  const later = new Set(after.edges.map(keyOf));
  const [earlierNames, laterNames] = [namesOf(before), namesOf(after)];

  /**
   * Returns an edge's entry, named from the names of its version's nodes.
   */
  const entry = (edge: Edge, change: GraphChangeType, names: Map<string, string>): GraphChange => ({
    change,
    fields: [],
    id: edge.id,
    label: edgeName({
      source: names.get(edge.source) ?? edge.source,
      target: names.get(edge.target) ?? edge.target,
    }),
  });

  return [
    ...after.edges.map((edge) =>
      entry(edge, earlier.has(keyOf(edge)) ? "unchanged" : "added", laterNames),
    ),
    ...before.edges
      .filter((edge) => !later.has(keyOf(edge)))
      .map((edge) => entry(edge, "removed", earlierNames)),
  ];
}

/**
 * Returns what the later version of a graph adds, changes and removes, node by node and edge by
 * edge.
 *
 * @param before - The earlier version.
 * @param after - The later version.
 * @param edgeName - Writes an edge's name from the names of its ends. `Orders to Revenue` unless
 *   stated.
 */
export function diffGraphs(
  before: GraphVersion,
  after: GraphVersion,
  edgeName: (ends: EdgeEnds) => string = edgeNameOf,
): GraphDiff {
  return { edges: edgesOf(before, after, edgeName), nodes: nodesOf(before, after) };
}
