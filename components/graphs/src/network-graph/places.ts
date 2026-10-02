/**
 * Lays a network out from its data alone: the links, the discs' diameters and the names' lengths.
 *
 * @remarks
 *   The layout runs over one box per node, as wide as its disc or its name, whichever is wider, and
 *   as tall as the disc and the name's line under it. A name is taken as 8.5px a character plus
 *   the pill's 8px of padding, and its line as 26px. Measured on 79 Latin names in the ten themes
 *   in Firefox and Chromium, the circle the layout keeps clear around each box contains the
 *   rendered node to within 0.1px. Letters wider than Latin ones, such as Chinese or Japanese, can
 *   make a name overlap its neighbour's. The layout reads no size React Flow measured, so the same
 *   graph and seed give the same picture in every engine, theme and font.
 *   Each position is the middle of the node's top edge, where the disc's middle is, and the disc
 *   node takes that point as its origin. The positions depend on the graph, the seed and the number
 *   of steps, never on the focus, so focusing a node moves none.
 */

import { type Node, type XYPosition } from "@xyflow/react";

import { type Size } from "#graph/changes.ts";
import { layoutForce } from "#layout/force.ts";
import { discsOf, type Sized } from "#network-graph/discs.ts";
import { type NetworkLink, type NetworkNode } from "#network-graph/types.ts";

/**
 * Width a name takes for each of its characters, in pixels.
 */
const CHARACTER = 8.5;

/**
 * Inline padding of a name's pill, both sides together, in pixels.
 */
const PILL = 8;

/**
 * Height of a name's line under the disc and the gap above it, in pixels.
 */
const NAME = 26;

/**
 * Describes what a layout is made from: the nodes, the links, the seed and the steps.
 */
export interface PlacesInput {
  /**
   * Number of the layout's steps.
   */
  readonly iterations: number;

  /**
   * Links the canvas renders.
   */
  readonly links: readonly NetworkLink[];

  /**
   * Nodes of the graph.
   */
  readonly nodes: readonly NetworkNode[];

  /**
   * Number the layout starts from.
   */
  readonly seed: number;
}

/**
 * Describes a sized node with the position the layout gave it.
 */
export interface Placed extends Sized {
  /**
   * Middle of the node's top edge, where the disc's middle is.
   */
  readonly position: XYPosition;
}

/**
 * Describes the data of a box the layout places: the sized node the box is for.
 */
interface BoxData extends Record<string, unknown> {
  /**
   * Node the box places, with the diameter of its disc.
   */
  readonly sized: Sized;
}

/**
 * Describes the box the layout places a node by.
 */
interface Box extends Node<BoxData> {
  /**
   * Size of the box, which the layout reads as a measured size.
   */
  readonly measured: Size;
}

/**
 * Returns the box the layout places a node by: as wide as its disc or its name, whichever is
 * wider, and as tall as the disc and the name's line.
 */
export function boxOf({ disc, node }: Sized): Size {
  return { height: disc + NAME, width: Math.max(disc, node.label.length * CHARACTER + PILL) };
}

/**
 * Returns each node, in order, with its disc and the middle of its top edge where the layout put
 * it.
 *
 * @param input - The nodes, the links, the seed and the steps.
 */
export function placesOf(input: PlacesInput): Placed[] {
  const boxes: Box[] = discsOf(input.nodes, input.links).map((sized) => ({
    data: { sized },
    id: sized.node.id,
    measured: boxOf(sized),
    position: { x: 0, y: 0 },
  }));
  const options = { iterations: input.iterations, seed: input.seed };

  return layoutForce(boxes, input.links, options).map(({ data, measured, position }) => ({
    disc: data.sized.disc,
    node: data.sized.node,
    position: { x: position.x + measured.width / 2, y: position.y },
  }));
}
