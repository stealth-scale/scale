/**
 * Places a force layout's nodes where its simulation starts: each connected part of the graph as a
 * tree around its most-linked node, one ring further out for each hop.
 *
 * @remarks
 *   Linked nodes start close, so the simulation seldom pulls a link across the picture, where it
 *   would cross other links or pass under discs it does not end at. A node's neighbours take the
 *   next ring out in an order the seed shuffles, with neighbours linked to each other side by side.
 *   Each takes a share of its parent's angle as large as the number of branch ends it leads to. A
 *   graph of one part starts with its most-linked node in the middle. In a graph of several parts,
 *   each part takes a share of the circle and starts one ring out, so no two parts start on one
 *   point.
 */

import { type XYPosition } from "@xyflow/react";

import { type Link } from "#graph/walk.ts";

/**
 * Describes a node while the start places it.
 */
interface Seat {
  /**
   * Nodes the node leads to, in the order they start around it.
   */
  readonly children: Seat[];

  /**
   * Number of hops from the middle of the node's part, or -1 before the walk visits the node.
   */
  depth: number;

  /**
   * Id of the node.
   */
  readonly id: string;

  /**
   * Number of branch ends the node leads to, or 1 for a node that leads to none.
   */
  leaves: number;

  /**
   * Nodes the node is linked to.
   */
  readonly neighbours: Set<Seat>;
}

/**
 * Describes an angle of the circle a node and the nodes it leads to start in.
 */
interface Arc {
  /**
   * Angle the arc starts at, in radians.
   */
  readonly from: number;

  /**
   * Node the arc places.
   */
  readonly seat: Seat;

  /**
   * Angle the arc ends at, in radians.
   */
  readonly to: number;
}

/**
 * Returns a seat for each id, linked to the seats its links reach. A link with an end outside the
 * graph links nothing.
 */
function seatsOf(ids: readonly string[], links: readonly Link[]): Seat[] {
  const seats: Seat[] = ids.map((id) => ({
    children: [],
    depth: -1,
    id,
    leaves: 1,
    neighbours: new Set(),
  }));
  const byId = new Map(seats.map((seat) => [seat.id, seat]));

  for (const { source, target } of links) {
    const [from, to] = [byId.get(source), byId.get(target)];

    if (from !== undefined && to !== undefined) {
      from.neighbours.add(to);
      to.neighbours.add(from);
    }
  }

  return seats;
}

/**
 * Returns the seats in an order the number source shuffles.
 */
function shuffled(seats: readonly Seat[], random: () => number): Seat[] {
  return seats
    .map((seat) => ({ key: random(), seat }))
    .toSorted((a, b) => a.key - b.key)
    .map(({ seat }) => seat);
}

/**
 * Returns the seats in their order, except that each seat linked to the one before it comes next.
 */
function chained(seats: readonly Seat[]): Seat[] {
  const chain: Seat[] = [];
  const left = [...seats];

  for (let at = 0; at < seats.length; at += 1) {
    const last = chain.at(-1);
    const next = last === undefined ? 0 : left.findIndex((seat) => last.neighbours.has(seat));

    chain.push(...left.splice(Math.max(next, 0), 1));
  }

  return chain;
}

/**
 * Walks each part breadth first from its most-linked seat, gives every seat its depth and its
 * children, and returns the seat each part starts from.
 */
function rootsOf(seats: readonly Seat[], random: () => number): Seat[] {
  const roots: Seat[] = [];

  for (const hub of seats.toSorted((a, b) => b.neighbours.size - a.neighbours.size)) {
    if (hub.depth >= 0) continue;

    const part = [hub];

    hub.depth = 0;
    roots.push(hub);

    for (const seat of part) {
      const unvisited = [...seat.neighbours].filter((neighbour) => neighbour.depth < 0);

      for (const child of chained(shuffled(unvisited, random))) {
        child.depth = seat.depth + 1;
        seat.children.push(child);
        part.push(child);
      }
    }

    for (const seat of part.toReversed()) {
      if (seat.children.length > 0) {
        seat.leaves = seat.children.reduce((sum, child) => sum + child.leaves, 0);
      }
    }
  }

  return roots;
}

/**
 * Returns the start of every node of a force layout.
 *
 * @param ids - The graph's nodes.
 * @param links - The links between the nodes, read as undirected.
 * @param random - The number source the order of each node's neighbours and the first angle come
 *   from.
 * @param step - The distance between two rings, in pixels.
 */
export function startsOf(
  ids: readonly string[],
  links: readonly Link[],
  random: () => number,
  step: number,
): Map<string, XYPosition> {
  const roots = rootsOf(seatsOf(ids, links), random);
  const total = roots.reduce((sum, root) => sum + root.leaves, 0);
  const offset = roots.length > 1 ? 1 : 0;
  const arcs: Arc[] = [];
  const starts = new Map<string, XYPosition>();
  let from = random() * Math.PI * 2;

  for (const seat of roots) {
    const to = from + (Math.PI * 2 * seat.leaves) / total;

    arcs.push({ from, seat, to });
    from = to;
  }

  for (const arc of arcs) {
    const angle = (arc.from + arc.to) / 2;
    const radius = (arc.seat.depth + offset) * step;
    let start = arc.from;

    starts.set(arc.seat.id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });

    for (const seat of arc.seat.children) {
      const end = start + ((arc.to - arc.from) * seat.leaves) / arc.seat.leaves;

      arcs.push({ from: start, seat, to: end });
      start = end;
    }
  }

  return starts;
}
