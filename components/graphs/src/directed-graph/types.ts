/**
 * Describes a directed graph in the caller's terms, the words it writes, and the props of the
 * preset.
 */

import { type ReactNode } from "react";

import type * as Graph from "#graph/index.ts";

/**
 * Describes one node of a directed graph: a table, a model, a person.
 */
export interface DirectedNode {
  /**
   * Line in the card's body.
   */
  readonly detail?: ReactNode | undefined;

  /**
   * Glyph before the name, from the caller. Hidden from assistive technology.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Identity the edges name the node by.
   */
  readonly id: string;

  /**
   * Kind of the node, such as `Table` or `Dashboard`, written under the name.
   */
  readonly kind?: string | undefined;

  /**
   * Name of the node, which is also its accessible name.
   */
  readonly label: string;

  /**
   * Freshness or health of the node, a dot in a palette beside a word.
   */
  readonly status?: Graph.GraphStatus | undefined;
}

/**
 * Describes one edge of a directed graph: the node it leaves and the node it enters.
 */
export interface DirectedEdge {
  /**
   * Identity of the edge. The ids of its ends, joined by a hyphen, unless stated.
   */
  readonly id?: string | undefined;

  /**
   * Id of the node the edge leaves, such as the table a model reads.
   */
  readonly source: string;

  /**
   * Id of the node the edge enters, such as the model that reads the table.
   */
  readonly target: string;
}

/**
 * Describes what a focus does to the other nodes: dims the nodes its trace leaves out, renders only
 * the nodes its trace finds, or only selects.
 */
export type TraceMode = "highlight" | "isolate" | "off";

/**
 * Describes a trace for the summary's words: the focused node's name and the number of nodes each
 * way.
 */
export interface Counts {
  /**
   * Number of nodes the focused node feeds.
   */
  readonly downstream: number;

  /**
   * Name of the focused node.
   */
  readonly name: string;

  /**
   * Number of nodes that feed the focused node.
   */
  readonly upstream: number;
}

/**
 * Describes the words a directed graph writes, each with an English default.
 */
export interface DirectedWords {
  /**
   * Words of the control that drops the focus. `Clear focus` unless stated.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Writes the words of the control that closes a branch from the number of nodes it hides.
   * `Hide 5` unless stated.
   */
  readonly collapseLabel?: ((count: number) => string) | undefined;

  /**
   * Word for a node the focused node feeds, which also names every port edges leave.
   * `Downstream` unless stated.
   */
  readonly downstreamLabel?: string | undefined;

  /**
   * Writes the name of an edge from the names of its ends. `Orders to Revenue` unless stated.
   */
  readonly edgeName?: ((ends: Graph.EdgeEnds) => string) | undefined;

  /**
   * Message in the canvas's place while the graph has no node. `No nodes to show.` unless stated.
   */
  readonly emptyLabel?: ReactNode | undefined;

  /**
   * Writes the words of the control that opens a branch from the number of nodes it shows.
   * `Show 5` unless stated.
   */
  readonly expandLabel?: ((count: number) => string) | undefined;

  /**
   * Word for the focused node. `Focus` unless stated.
   */
  readonly focusLabel?: string | undefined;

  /**
   * Instruction every node is described by for a screen reader, which offers Enter, Space and
   * Escape unless stated.
   */
  readonly nodeDescription?: string | undefined;

  /**
   * Words of the summary while nothing is focused.
   */
  readonly promptLabel?: ReactNode | undefined;

  /**
   * Writes the summary of a trace. `Revenue: 3 upstream, 2 downstream` unless stated.
   */
  readonly summary?: ((counts: Counts) => ReactNode) | undefined;

  /**
   * Word for a node that feeds the focused node, which also names every port edges enter.
   * `Upstream` unless stated.
   */
  readonly upstreamLabel?: string | undefined;
}

/**
 * Describes the props of a directed graph: the graph, its focus and branches, its parts beside the
 * canvas, its words, and the props of `Graph.Root`.
 */
export interface DirectedGraphProps extends DirectedWords, Omit<Graph.RootProps, "children"> {
  /**
   * The finding in words, which names the figure.
   */
  readonly caption?: ReactNode | undefined;

  /**
   * Ids of the nodes whose branches are closed, controlled.
   */
  readonly collapsed?: readonly string[] | undefined;

  /**
   * Whether a node that leads to other nodes renders a control that closes its branch.
   */
  readonly collapsible?: boolean | undefined;

  /**
   * Toolbar above the canvas, such as `Graph.Controls` with the caller's glyphs.
   */
  readonly controls?: ReactNode | undefined;

  /**
   * Ids of the nodes whose branches are closed on the first render.
   */
  readonly defaultCollapsed?: readonly string[] | undefined;

  /**
   * Node focused on the first render, or `null` for none.
   */
  readonly defaultFocus?: null | string | undefined;

  /**
   * Number of hops each way a trace follows. Every hop unless stated.
   */
  readonly depth?: number | undefined;

  /**
   * Edges of the graph.
   */
  readonly edges: readonly DirectedEdge[];

  /**
   * Focused node, controlled, or `null` for none.
   */
  readonly focus?: null | string | undefined;

  /**
   * Accessible name of the canvas.
   */
  readonly label: string;

  /**
   * Nodes of the graph, in any order.
   */
  readonly nodes: readonly DirectedNode[];

  /**
   * Called with the ids of the closed branches whenever a branch opens or closes.
   */
  readonly onCollapsedChange?: ((ids: string[]) => void) | undefined;

  /**
   * Called with the focused node's id, or `null` when the focus is dropped.
   */
  readonly onFocusChange?: ((id: null | string) => void) | undefined;

  /**
   * Overview map below the canvas, such as `Graph.MiniMap`.
   */
  readonly overview?: ReactNode | undefined;

  /**
   * Effect of a focus on the other nodes. `highlight` unless stated.
   */
  readonly trace?: TraceMode | undefined;
}
