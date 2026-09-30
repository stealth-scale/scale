/**
 * Describes a network graph in the caller's terms, the words it writes, and the props of the
 * preset.
 */

import { type ReactNode } from "react";

import type * as Graph from "#graph/index.ts";
import { type ForceLink } from "#layout/force.ts";

/**
 * Describes one node of a network: a service, a bank, a person.
 */
export interface NetworkNode {
  /**
   * Glyph in the disc, from the caller. Hidden from assistive technology.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Identity the links name the node by.
   */
  readonly id: string;

  /**
   * Name under the disc, which is also the node's accessible name.
   */
  readonly label: string;

  /**
   * Importance of the node, which sizes its disc against the heaviest node's. The number of its
   * links unless stated.
   */
  readonly weight?: number | undefined;
}

/**
 * Describes one link of a network: two nodes it ties, read the same either way round.
 */
export interface NetworkLink extends ForceLink {
  /**
   * Identity of the link. The ids of its ends, joined by a hyphen, unless stated.
   */
  readonly id?: string | undefined;
}

/**
 * Describes a focused node for the summary's words: its name and the number of nodes it connects
 * to.
 */
export interface Connections {
  /**
   * Number of nodes within `depth` hops of the focused node.
   */
  readonly count: number;

  /**
   * Name of the focused node.
   */
  readonly name: string;
}

/**
 * Describes the words a network graph writes, each with an English default.
 */
export interface NetworkWords {
  /**
   * Words of the control that drops the focus. `Clear focus` unless stated.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Writes the name of a link from the names of its ends. `Orders and Billing` unless stated.
   */
  readonly edgeName?: ((ends: Graph.EdgeEnds) => string) | undefined;

  /**
   * Message in the canvas's place while the graph has no node. `No nodes to show.` unless stated.
   */
  readonly emptyLabel?: ReactNode | undefined;

  /**
   * Word the focused node's accessible name ends with. `Focus` unless stated.
   */
  readonly focusLabel?: string | undefined;

  /**
   * Writes the announcement of a move the arrow keys make.
   */
  readonly moveAnnouncement?: ((move: Graph.Move) => string) | undefined;

  /**
   * Word the accessible name of a node the focused node connects to ends with. `Connected` unless
   * stated.
   */
  readonly neighborLabel?: string | undefined;

  /**
   * Instruction every node is described by for a screen reader, which offers Enter, Space, Escape
   * and, while nodes can be dragged, the arrow keys unless stated.
   */
  readonly nodeDescription?: string | undefined;

  /**
   * Words of the summary while nothing is focused.
   */
  readonly promptLabel?: ReactNode | undefined;

  /**
   * Writes the summary of a focus. `Orders: 3 connections` unless stated.
   */
  readonly summary?: ((connections: Connections) => ReactNode) | undefined;
}

/**
 * Describes the props of a network graph: the graph, its focus, its layout, its parts beside the
 * canvas, its words, and the props of `Graph.Root`.
 */
export interface NetworkGraphProps
  extends NetworkWords, Omit<Graph.RootProps, "children" | "direction"> {
  /**
   * The finding in words, which names the figure.
   */
  readonly caption?: ReactNode | undefined;

  /**
   * Toolbar above the canvas, such as `Graph.Controls` with the caller's glyphs.
   */
  readonly controls?: ReactNode | undefined;

  /**
   * Node focused on the first render, or `null` for none.
   */
  readonly defaultFocus?: null | string | undefined;

  /**
   * Number of hops from the focused node within which a node is lit. 1 unless stated.
   */
  readonly depth?: number | undefined;

  /**
   * Whether a person can move a node by dragging it or by the arrow keys. On unless stated.
   */
  readonly draggable?: boolean | undefined;

  /**
   * Focused node, controlled, or `null` for none.
   */
  readonly focus?: null | string | undefined;

  /**
   * Number of the layout's steps. 300 unless stated.
   */
  readonly iterations?: number | undefined;

  /**
   * Accessible name of the canvas.
   */
  readonly label: string;

  /**
   * Links of the graph, read the same either way round.
   */
  readonly links: readonly NetworkLink[];

  /**
   * Nodes of the graph, in any order.
   */
  readonly nodes: readonly NetworkNode[];

  /**
   * Called with the focused node's id, or `null` when the focus is dropped.
   */
  readonly onFocusChange?: ((id: null | string) => void) | undefined;

  /**
   * Overview map below the canvas, such as `Graph.MiniMap`.
   */
  readonly overview?: ReactNode | undefined;

  /**
   * Number the layout starts from. The same seed and graph give the same picture. 1 unless stated.
   */
  readonly seed?: number | undefined;
}
