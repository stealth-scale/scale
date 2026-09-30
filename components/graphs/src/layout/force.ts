/**
 * Places a network's nodes by a force simulation, so linked nodes are close and no two overlap.
 *
 * @remarks
 *   The layout runs d3-force for 300 steps from a start where linked nodes are close, each part of
 *   the graph a tree around its most-linked node, with an order the seed shuffles. The same graph
 *   and seed give the same positions, so a person who comes back to a graph finds it where it was.
 *   The layout does not route a link around a node it passes, so another seed is the way to a
 *   picture where no link crosses a node it does not end at. A link pulls its ends to 110px
 *   apart, and to 55px for a link of strength 2 or more. Every node pushes every other away, a
 *   collision keeps each node's box inside a circle no other circle enters, and a pull to the
 *   middle, 3 times stronger up and down than across, keeps a graph wider than tall, as a canvas
 *   is. A link whose ends are not both nodes of the graph, or that ties a node to itself, takes no
 *   part. A node is placed by its measured, stated or initial size, else 256 by 44 pixels, with its
 *   middle on the simulation's point, and comes back with that size as its initial size, as
 *   `layoutGraph` returns it. The simulation's push between nodes is a Barnes–Hut approximation, so
 *   a step costs n log n.
 */

import { type Node, type XYPosition } from "@xyflow/react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";

import { type Size } from "#graph/changes.ts";
import { type Link } from "#graph/walk.ts";
import { sizeOf } from "#layout/size.ts";
import { startsOf } from "#layout/start.ts";

/**
 * Length of a link of strength 1, in pixels.
 */
const DISTANCE = 110;

/**
 * Push between every two nodes. A negative strength pushes.
 */
const CHARGE = -500;

/**
 * Strength of the pull to the middle across the canvas.
 */
const PULL = 0.05;

/**
 * How much stronger the pull to the middle is up and down than across.
 */
const FLATTEN = 3;

/**
 * Describes a link a force layout pulls its ends together along.
 */
export interface ForceLink extends Link {
  /**
   * How strongly the link ties its ends, 1 unless stated. A tie of 2 or more pulls the ends twice
   * as close as a tie of 1.
   */
  readonly strength?: number | undefined;
}

/**
 * Describes how `layoutForce` runs its simulation.
 */
export interface ForceOptions {
  /**
   * Number of the simulation's steps. 300 unless stated.
   */
  readonly iterations?: number | undefined;

  /**
   * Number the start's order of neighbours comes from. The same seed and graph give the same
   * positions. 1 unless stated.
   */
  readonly seed?: number | undefined;
}

/**
 * Describes a node in the simulation: the graph's node, its size and the radius the collision
 * keeps clear around it.
 *
 * @typeParam N - One node of the graph.
 */
interface Body<N extends Node> extends SimulationNodeDatum {
  /**
   * The graph's node.
   */
  readonly node: N;

  /**
   * Half the node box's diagonal, in pixels.
   */
  readonly radius: number;

  /**
   * Size the node is placed by.
   */
  readonly size: Size;
}

/**
 * Describes a link in the simulation with how strongly it ties its ends.
 *
 * @typeParam N - One node of the graph.
 */
interface Tie<N extends Node> extends SimulationLinkDatum<Body<N>> {
  /**
   * How strongly the link ties its ends, from 1 to 2.
   */
  readonly strength: number;
}

/**
 * Returns how strongly a link ties its ends, from 1 to 2: its strength, 1 unless stated.
 */
export function strengthOf(link: ForceLink): number {
  return Math.min(Math.max(link.strength ?? 1, 1), 2);
}

/**
 * Returns a number source that yields the same numbers for the same seed.
 */
function seeded(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;

    return state / 4_294_967_296;
  };
}

/**
 * Returns the simulation's nodes at their starts.
 */
function bodiesOf<N extends Node>(
  nodes: readonly N[],
  starts: ReadonlyMap<string, XYPosition>,
): Array<Body<N>> {
  return nodes.map((node) => {
    const size = sizeOf(node);
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- startsOf starts every node it is given
    const { x, y } = starts.get(node.id) as XYPosition;

    return { node, radius: Math.hypot(size.width, size.height) / 2, size, x, y };
  });
}

/**
 * Returns the simulation's links: each link between two different nodes of the graph.
 */
function tiesOf<N extends Node>(
  links: readonly ForceLink[],
  ids: ReadonlySet<string>,
): Array<Tie<N>> {
  return links
    .filter(({ source, target }) => source !== target && ids.has(source) && ids.has(target))
    .map((link) => ({ source: link.source, strength: strengthOf(link), target: link.target }));
}

/**
 * Returns the nodes placed by the force simulation, each with the size it was placed by as its
 * initial size.
 *
 * @typeParam N - One node of the graph.
 * @param nodes - The graph's nodes, in any order.
 * @param links - The links between the nodes, read as undirected.
 * @param options - The number of steps and the seed.
 */
export function layoutForce<N extends Node>(
  nodes: readonly N[],
  links: readonly ForceLink[],
  options: ForceOptions = {},
): N[] {
  const { iterations = 300, seed = 1 } = options;
  const random = seeded(seed);
  const ids = nodes.map((node) => node.id);
  const bodies = bodiesOf(nodes, startsOf(ids, links, random, DISTANCE));
  const ties = tiesOf<N>(links, new Set(ids));

  forceSimulation(bodies)
    .randomSource(random)
    .force(
      "link",
      forceLink<Body<N>, Tie<N>>(ties)
        .id((body) => body.node.id)
        .distance((tie) => DISTANCE / tie.strength),
    )
    .force("charge", forceManyBody<Body<N>>().strength(CHARGE))
    .force("collide", forceCollide<Body<N>>((body) => body.radius).iterations(2))
    .force("x", forceX<Body<N>>().strength(PULL))
    .force("y", forceY<Body<N>>().strength(PULL * FLATTEN))
    .force("center", forceCenter<Body<N>>())
    .stop()
    .tick(iterations);

  const placed: N[] = [];

  for (const { node, size, x = 0, y = 0 } of bodies) {
    placed.push({
      ...node,
      initialHeight: size.height,
      initialWidth: size.width,
      position: { x: x - size.width / 2, y: y - size.height / 2 },
    });
  }

  return placed;
}
