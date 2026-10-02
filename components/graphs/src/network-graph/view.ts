/**
 * Works out a network graph's view for the canvas: each node's disc, where the layout put it, what
 * a focus lights, and how each link reads against the focus.
 *
 * @remarks
 *   A disc node's position is the middle of its top edge, and the node takes that point as its
 *   origin, so React Flow centres the node on it at whatever width it measures. The view is
 *   complete once React Flow has measured every node. A focus lights the nodes within `depth` hops
 *   of it and dims the rest, and the focused node's and each lit node's accessible name ends with a
 *   word, because a dimmed disc is a change of edge a screen reader does not hear. A link is on the
 *   lit set while both its ends are lit or focused, and renders wider for a stronger tie. The
 *   positions come from the layout alone, so focusing a node moves none.
 */

import { type ReactNode } from "react";

import { type Edge, type Node, type NodeOrigin } from "@xyflow/react";

import { type Size } from "#graph/changes.ts";
import { traceMarkOf } from "#graph/marks.ts";
import { strengthOf } from "#layout/force.ts";
import { type Drawn, neighborsOf } from "#network-graph/network.ts";
import { type Placed } from "#network-graph/places.ts";
import { type Connections } from "#network-graph/types.ts";
import { type Words } from "#network-graph/words.ts";

/**
 * Point of a disc node its position is: the middle of its top edge.
 */
const TOP_MIDDLE: NodeOrigin = [0.5, 0];

/**
 * Describes what a disc renders: the node's name and icon, the disc's diameter, and whether the
 * node recedes.
 */
export interface DiscData extends Record<string, unknown> {
  /**
   * Whether the node recedes, as a node outside a focus's reach does.
   */
  readonly dimmed: boolean;

  /**
   * Diameter of the disc, in pixels.
   */
  readonly disc: number;

  /**
   * Glyph in the disc.
   */
  readonly icon?: ReactNode;

  /**
   * Name of the node, under the disc.
   */
  readonly label: string;
}

/**
 * Describes a node of the network as React Flow renders it.
 */
export type DiscNode = Node<DiscData, "disc">;

/**
 * Describes what a view is made from: the placed nodes, the links, the focus, the sizes and the
 * words.
 */
export interface ViewInput {
  /**
   * Number of hops from the focused node within which a node is lit.
   */
  readonly depth: number;

  /**
   * Links the canvas renders, with the nodes at their ends.
   */
  readonly drawn: readonly Drawn[];

  /**
   * Focused node, or `null` for none.
   */
  readonly focus: null | string;

  /**
   * Nodes of the graph with their discs and positions.
   */
  readonly placed: readonly Placed[];

  /**
   * Size React Flow measured for each node it has rendered.
   */
  readonly sizes: ReadonlyMap<string, Size>;

  /**
   * Words the names are written in.
   */
  readonly words: Words;
}

/**
 * Describes a view: the nodes and links the canvas renders and the nodes a focus lights.
 */
export interface View {
  /**
   * Whether React Flow has measured every node.
   */
  readonly complete: boolean;

  /**
   * Reach of the focused node, while a node is focused.
   */
  readonly connections: Connections | undefined;

  /**
   * Links the canvas renders.
   */
  readonly edges: Edge[];

  /**
   * Nodes the canvas renders, where the layout put them.
   */
  readonly nodes: DiscNode[];
}

/**
 * Returns the word a node's accessible name ends with: the focus's, a lit node's, or none.
 */
function tagOf(id: string, input: ViewInput, lit?: ReadonlySet<string>): string | undefined {
  if (id === input.focus) return input.words.focusLabel;

  return lit?.has(id) === true ? input.words.neighborLabel : undefined;
}

/**
 * Returns the disc of one node, where the layout put it.
 */
function discOf(
  { disc, node, position }: Placed,
  input: ViewInput,
  lit?: ReadonlySet<string>,
): DiscNode {
  const tag = tagOf(node.id, input, lit);
  const size = input.sizes.get(node.id);

  return {
    ariaLabel: tag === undefined ? node.label : `${node.label}, ${tag}`,
    data: {
      dimmed: lit !== undefined && tag === undefined,
      disc,
      icon: node.icon,
      label: node.label,
    },
    id: node.id,
    origin: TOP_MIDDLE,
    position,
    selected: node.id === input.focus,
    type: "disc",
    ...(size === undefined ? {} : { measured: size }),
  };
}

/**
 * Returns a link for React Flow: a straight line named by its ends, as wide as its tie, and marked
 * on or off the lit set while a node is focused.
 */
function edgeOf({ from, link, to }: Drawn, input: ViewInput, lit?: ReadonlySet<string>): Edge {
  const strength: Record<string, string> = { "--graph-strength": String(strengthOf(link)) };
  const on = [from.id, to.id].every((id) => id === input.focus || lit?.has(id) === true);

  return {
    ariaLabel: input.words.edgeName({ source: from.label, target: to.label }),
    id: link.id ?? `${from.id}-${to.id}`,
    selectable: false,
    source: from.id,
    style: strength,
    target: to.id,
    type: "straight",
    ...(lit === undefined ? {} : { domAttributes: traceMarkOf(on) }),
  };
}

/**
 * Returns a focus's connections: the focused node's name, else its id, and the number of nodes lit.
 */
function connectionsOf(input: ViewInput, lit?: ReadonlySet<string>): Connections | undefined {
  const { focus, placed } = input;

  if (focus === null || lit === undefined) return undefined;

  return {
    count: lit.size,
    name: placed.find(({ node }) => node.id === focus)?.node.label ?? focus,
  };
}

/**
 * Returns the view of a network graph: its discs where the layout put them and its links.
 *
 * @param input - The placed nodes, the links, the focus, the sizes and the words.
 */
export function viewOf(input: ViewInput): View {
  const links = input.drawn.map(({ link }) => link);
  const lit = input.focus === null ? undefined : neighborsOf(links, input.focus, input.depth);

  return {
    complete: input.placed.every(({ node }) => input.sizes.has(node.id)),
    connections: connectionsOf(input, lit),
    edges: input.drawn.map((drawn) => edgeOf(drawn, input, lit)),
    nodes: input.placed.map((placed) => discOf(placed, input, lit)),
  };
}
