/**
 * Works out a directed graph's view for the canvas: the nodes it shows, what each card states, how
 * each edge reads against a trace, and where each node is placed.
 *
 * @remarks
 *   Every node renders once at the origin until React Flow has measured every node of the graph,
 *   so the layout places each node by its measured size and a later change of what shows does not
 *   need a second measurement. After that a node shows while no collapsed node hides it, and while
 *   an isolated trace is on only the focused node and the nodes it traced show. A card states its
 *   relation to the focused node in a word, which also ends its accessible name, and an unrelated
 *   card recedes while the trace highlights. An edge is on the traced path while both its ends are
 *   related. The positions depend on the nodes that show, their sizes and the direction, never on
 *   the focus, so focusing a node moves none. Every card has a port on each side, marked unused
 *   while no shown edge meets that side, because React Flow never measures a port that mounts
 *   after its node.
 */

import { type ReactNode } from "react";

import { type Edge, type Node } from "@xyflow/react";

import { hiddenBy } from "#directed-graph/branches.ts";
import { type Relation, relationOf, type Trace, traceGraph } from "#directed-graph/trace.ts";
import {
  type Counts,
  type DirectedEdge,
  type DirectedNode,
  type TraceMode,
} from "#directed-graph/types.ts";
import { type Words } from "#directed-graph/words.ts";
import { type Size } from "#graph/changes.ts";
import type * as Graph from "#graph/index.ts";
import { traceMarkOf } from "#graph/marks.ts";
import { type GraphDirection, layoutGraph } from "#layout/rank.ts";

/**
 * Describes a card's branch control: whether the branch is open and the control's words.
 */
export interface Branch {
  /**
   * Whether the node's branch shows.
   */
  readonly expanded: boolean;

  /**
   * Words of the control, with the number of nodes a press hides or shows.
   */
  readonly label: string;
}

/**
 * Describes what a card states: the node's words, its ports, its relation and its branch.
 */
export interface CardData extends Record<string, unknown> {
  /**
   * Branch control, for a node whose branch a press changes.
   */
  readonly branch?: Branch | undefined;

  /**
   * Line in the card's body.
   */
  readonly detail?: ReactNode;

  /**
   * Whether the card recedes, as an unrelated node does while a trace highlights.
   */
  readonly dimmed: boolean;

  /**
   * Glyph before the name.
   */
  readonly icon?: ReactNode;

  /**
   * Port edges enter, unused while no shown edge enters the node.
   */
  readonly inputs: readonly Graph.GraphPort[];

  /**
   * Kind of the node, under the name.
   */
  readonly kind?: string | undefined;

  /**
   * Name of the node.
   */
  readonly label: string;

  /**
   * Port edges leave, unused while no shown edge leaves the node.
   */
  readonly outputs: readonly Graph.GraphPort[];

  /**
   * Freshness or health of the node.
   */
  readonly status?: Graph.GraphStatus | undefined;

  /**
   * Word for the node's relation to the focused node.
   */
  readonly tag?: string | undefined;
}

/**
 * Describes a node of the directed graph as React Flow renders it.
 */
export type CardNode = Node<CardData, "directed">;

/**
 * Describes what a view is made from: the graph, its state, the measured sizes and the words.
 */
export interface ViewInput {
  /**
   * Ids of the nodes whose branches are closed.
   */
  readonly collapsed: ReadonlySet<string>;

  /**
   * Whether a node's branch can close.
   */
  readonly collapsible: boolean;

  /**
   * Number of hops each way a trace follows.
   */
  readonly depth: number;

  /**
   * Way the edges run.
   */
  readonly direction: GraphDirection;

  /**
   * Edges of the graph.
   */
  readonly edges: readonly DirectedEdge[];

  /**
   * Focused node, or `null` for none.
   */
  readonly focus: null | string;

  /**
   * Nodes of the graph.
   */
  readonly nodes: readonly DirectedNode[];

  /**
   * Size React Flow measured for each node it has rendered.
   */
  readonly sizes: ReadonlyMap<string, Size>;

  /**
   * Effect of a focus on the other nodes.
   */
  readonly trace: TraceMode;

  /**
   * Words the cards and the edges' names are written in.
   */
  readonly words: Words;
}

/**
 * Describes a view: the nodes and edges the canvas renders, the trace in numbers, and whether every
 * node of the graph has been measured.
 */
export interface View {
  /**
   * Whether React Flow has measured every node of the graph, which places the nodes.
   */
  readonly complete: boolean;

  /**
   * Trace of the focused node in numbers, over the whole graph, while a node is focused.
   */
  readonly counts: Counts | undefined;

  /**
   * Edges the canvas renders.
   */
  readonly edges: Edge[];

  /**
   * Nodes the canvas renders.
   */
  readonly nodes: CardNode[];
}

/**
 * Describes an edge whose ends both show, with the nodes at its ends.
 */
interface Kept {
  /**
   * The edge as the caller passed it.
   */
  readonly edge: DirectedEdge;

  /**
   * Node the edge leaves.
   */
  readonly from: DirectedNode;

  /**
   * Node the edge enters.
   */
  readonly to: DirectedNode;
}

/**
 * Describes what one card needs from the whole view.
 */
interface Scope {
  /**
   * Ids of the nodes a shown edge enters.
   */
  readonly entered: ReadonlySet<string>;

  /**
   * Ids of the nodes the graph hides behind closed branches.
   */
  readonly hidden: ReadonlySet<string>;

  /**
   * Ids of every node of the graph.
   */
  readonly ids: readonly string[];

  /**
   * Ids of the nodes a shown edge leaves.
   */
  readonly left: ReadonlySet<string>;

  /**
   * Relation of each node to the focused node, while a trace shows relations.
   */
  readonly relations: ReadonlyMap<string, Relation>;
}

/**
 * Returns the ids of the nodes the canvas shows.
 */
function shownOf(input: ViewInput, hidden: ReadonlySet<string>, traced?: Trace): Set<string> {
  const kept = input.nodes.map((node) => node.id).filter((id) => !hidden.has(id));

  if (input.trace !== "isolate" || traced === undefined) return new Set(kept);

  return new Set(
    kept.filter((id) => id === input.focus || traced.upstream.has(id) || traced.downstream.has(id)),
  );
}

/**
 * Returns the relation of each shown node to the focused node, while a trace shows relations.
 */
function relationsOf(
  input: ViewInput,
  shown: ReadonlySet<string>,
  traced?: Trace,
): Map<string, Relation> {
  const { focus, trace } = input;

  if (focus === null || traced === undefined || trace === "off") return new Map();

  return new Map([...shown].map((id) => [id, relationOf(id, focus, traced)]));
}

/**
 * Returns the word for a relation, or undefined for an unrelated node.
 */
function tagOf(relation: Relation | undefined, words: Words): string | undefined {
  if (relation === "focus") return words.focusLabel;
  if (relation === "upstream") return words.upstreamLabel;

  return relation === "downstream" ? words.downstreamLabel : undefined;
}

/**
 * Returns a node's branch control: the number of nodes a press hides or shows, or undefined while
 * a press changes nothing.
 */
function branchOf(id: string, input: ViewInput, scope: Scope): Branch | undefined {
  if (!input.collapsible) return undefined;

  const expanded = !input.collapsed.has(id);
  const toggled = new Set(input.collapsed);

  if (expanded) toggled.add(id);
  else toggled.delete(id);

  const count = Math.abs(hiddenBy(scope.ids, input.edges, toggled).size - scope.hidden.size);
  const label = expanded ? input.words.collapseLabel(count) : input.words.expandLabel(count);

  return count === 0 ? undefined : { expanded, label };
}

/**
 * Returns the card of one node, unplaced.
 */
function cardOf(node: DirectedNode, input: ViewInput, scope: Scope): CardNode {
  const { words } = input;
  const relation = scope.relations.get(node.id);
  const tag = tagOf(relation, words);
  const size = input.sizes.get(node.id);
  const data: CardData = {
    branch: branchOf(node.id, input, scope),
    detail: node.detail,
    dimmed: relation === "unrelated",
    icon: node.icon,
    inputs: [{ id: "in", label: words.upstreamLabel, unused: !scope.entered.has(node.id) }],
    kind: node.kind,
    label: node.label,
    outputs: [{ id: "out", label: words.downstreamLabel, unused: !scope.left.has(node.id) }],
    status: node.status,
    tag,
  };

  return {
    ariaLabel: tag === undefined ? node.label : `${node.label}, ${tag}`,
    data,
    id: node.id,
    position: { x: 0, y: 0 },
    selected: node.id === input.focus,
    type: "directed",
    ...(size === undefined ? {} : { measured: size }),
  };
}

/**
 * Returns the edges whose ends are both among the visible nodes, each with the nodes at its ends.
 */
function keptOf(
  edges: readonly DirectedEdge[],
  visible: ReadonlyMap<string, DirectedNode>,
): Kept[] {
  return edges.flatMap((edge) => {
    const from = visible.get(edge.source);
    const to = visible.get(edge.target);

    return from === undefined || to === undefined ? [] : [{ edge, from, to }];
  });
}

/**
 * Returns the kept edges for React Flow, named by their ends and marked on or off a traced path
 * while a trace shows relations.
 */
function edgesOf(input: ViewInput, kept: readonly Kept[], scope: Scope): Edge[] {
  return kept.map(({ edge, from, to }) => {
    const on = [from, to].every((end) => scope.relations.get(end.id) !== "unrelated");

    return {
      ariaLabel: input.words.edgeName({ source: from.label, target: to.label }),
      id: edge.id ?? `${from.id}-${to.id}`,
      selectable: false,
      source: from.id,
      target: to.id,
      ...(scope.relations.size === 0 ? {} : { domAttributes: traceMarkOf(on) }),
    };
  });
}

/**
 * Returns the trace of the focused node in numbers, named by the node's label, else by its id.
 */
function countsOf(input: ViewInput, traced?: Trace): Counts | undefined {
  const { focus, nodes } = input;

  if (focus === null || traced === undefined) return undefined;

  return {
    downstream: traced.downstream.size,
    name: nodes.find((node) => node.id === focus)?.label ?? focus,
    upstream: traced.upstream.size,
  };
}

/**
 * Returns the view of a directed graph: its cards and edges, placed once every node has been
 * measured.
 *
 * @param input - The graph, its state, the measured sizes and the words.
 */
export function viewOf(input: ViewInput): View {
  const ids = input.nodes.map((node) => node.id);
  const complete = ids.every((id) => input.sizes.has(id));
  const traced =
    input.focus === null ? undefined : traceGraph(input.edges, input.focus, input.depth);
  const hidden = input.collapsible
    ? hiddenBy(ids, input.edges, input.collapsed)
    : new Set<string>();
  const shown = complete ? shownOf(input, hidden, traced) : new Set(ids);
  const visible = new Map(
    input.nodes.filter((node) => shown.has(node.id)).map((node) => [node.id, node]),
  );
  const kept = keptOf(input.edges, visible);
  const scope: Scope = {
    entered: new Set(kept.map(({ to }) => to.id)),
    hidden,
    ids,
    left: new Set(kept.map(({ from }) => from.id)),
    relations: relationsOf(input, shown, traced),
  };
  const cards = [...visible.values()].map((node) => cardOf(node, input, scope));
  const edges = edgesOf(input, kept, scope);

  return {
    complete,
    counts: countsOf(input, traced),
    edges,
    nodes: complete ? layoutGraph(cards, edges, { direction: input.direction }) : cards,
  };
}
