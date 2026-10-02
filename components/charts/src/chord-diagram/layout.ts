/**
 * Lays out a chord diagram from a flow graph: each node an arc as long as what it sends, and each
 * pair of nodes one ribbon whose two ends are as wide as the two directions between them.
 *
 * @remarks
 *   Angles are radians from 12 o'clock, clockwise, as d3-chord's. An arc's feet tile it, one per
 *   node in the nodes' order, each as wide as what the arc's node sends to that node, 0 included,
 *   so a ribbon that flows one way ends in a point. A pair's two directions
 *   are one ribbon, so the ribbon is wider at the node that sends more. A flow from a node to
 *   itself is a ribbon whose two ends are one foot. A flow counts between two known nodes with a
 *   finite value above zero, and flows between the same two nodes add up. A node no counted flow
 *   touches has no arc, and a node that only receives has an arc of no length. The arcs are `pad`
 *   apart, and the spaces between them take at most half the circle.
 */

import { counted, type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";

/**
 * Space between two arcs unless the nodes are too many for it, in radians.
 */
const PAD = 0.06;

/**
 * Length of the circle, in radians.
 */
const TAU = Math.PI * 2;

/**
 * Describes a span of the circle: a node's arc, or one end of a ribbon inside it.
 */
export interface ChordSpan {
  /**
   * End of the span, in radians from 12 o'clock, clockwise.
   */
  readonly endAngle: number;

  /**
   * Key of the node the span is on.
   */
  readonly key: string;

  /**
   * Start of the span, in radians from 12 o'clock, clockwise.
   */
  readonly startAngle: number;

  /**
   * Amount the span is as long as: what an arc's node sends, or what a ribbon's end sends to the
   * other end.
   */
  readonly value: number;
}

/**
 * Describes a ribbon: two nodes and the two directions between them.
 */
export interface ChordRibbon {
  /**
   * End on the node earlier in the nodes' order, as wide as what that node sends to the other.
   */
  readonly source: ChordSpan;

  /**
   * End on the other node, as wide as what it sends back, or the source's end for a node's flow to
   * itself.
   */
  readonly target: ChordSpan;
}

/**
 * Describes a chord diagram's layout: the arcs and the ribbons.
 */
export interface ChordLayout {
  /**
   * Arcs of the nodes a counted flow touches, in the nodes' order.
   */
  readonly groups: readonly ChordSpan[];

  /**
   * Ribbons by their source's arc, then by their target's.
   */
  readonly ribbons: readonly ChordRibbon[];
}

/**
 * Describes how amounts become angles: the space between two arcs and the angle of one unit.
 */
interface Scale {
  /**
   * Space between two arcs, in radians.
   */
  readonly gap: number;

  /**
   * Angle of one unit of the flows' values, in radians.
   */
  readonly unit: number;
}

/**
 * Describes the arcs laid out one after another: each node's arc, and each foot inside the arcs by
 * pair.
 */
interface Arcs {
  /**
   * Foot of the flow from one node to another, by pair.
   */
  readonly feet: ReadonlyMap<string, ChordSpan>;

  /**
   * Arc of each node, in the nodes' order.
   */
  readonly groups: ChordSpan[];
}

/**
 * Returns the key of the flow from one node to another in a map of pairs.
 */
function pairOf(from: string, to: string): string {
  return JSON.stringify([from, to]);
}

/**
 * Returns what each node sends to each node by pair, the flows between the same two nodes added up.
 */
function sumsOf(flows: readonly SankeyFlow[]): Map<string, number> {
  const sums = new Map<string, number>();

  for (const flow of flows) {
    const pair = pairOf(flow.from, flow.to);

    sums.set(pair, (sums.get(pair) ?? 0) + flow.value);
  }

  return sums;
}

/**
 * Returns each node's arc and, by pair, each foot inside the arcs: the arcs one after another from
 * 12 o'clock, each foot as long as what its node sends to the other node.
 *
 * @param keys - The keys of the nodes with arcs, in the nodes' order.
 * @param sums - The amount each node sends to each node, by pair.
 * @param scale - The space between two arcs and the angle of one unit.
 */
function arcsOf(keys: readonly string[], sums: ReadonlyMap<string, number>, scale: Scale): Arcs {
  const feet = new Map<string, ChordSpan>();
  const groups: ChordSpan[] = [];
  let cursor = 0;

  for (const from of keys) {
    const startAngle = cursor;
    let value = 0;

    for (const to of keys) {
      const sent = sums.get(pairOf(from, to)) ?? 0;

      feet.set(pairOf(from, to), {
        endAngle: cursor + sent * scale.unit,
        key: from,
        startAngle: cursor,
        value: sent,
      });
      cursor += sent * scale.unit;
      value += sent;
    }

    groups.push({ endAngle: cursor, key: from, startAngle, value });
    cursor += scale.gap;
  }

  return { feet, groups };
}

/**
 * Returns a ribbon per pair of nodes with a flow either way, and per node with a flow to itself.
 *
 * @param keys - The keys of the nodes with arcs, in the nodes' order.
 * @param feet - Each foot inside the arcs, by pair.
 */
function ribbonsOf(keys: readonly string[], feet: ReadonlyMap<string, ChordSpan>): ChordRibbon[] {
  const ribbons: ChordRibbon[] = [];

  /**
   * Returns the foot of the flow from one node to another, which the arcs lay for every pair.
   */
  const footOf = (from: string, to: string): ChordSpan =>
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the arcs lay a foot for every pair of nodes
    feet.get(pairOf(from, to)) as ChordSpan;

  for (const [at, from] of keys.entries()) {
    for (const to of keys.slice(at)) {
      const source = footOf(from, to);
      const target = footOf(to, from);

      if (source.value > 0 || target.value > 0) ribbons.push({ source, target });
    }
  }

  return ribbons;
}

/**
 * Lays out the nodes' arcs and a ribbon per pair of nodes with a flow between them.
 *
 * @param nodes - The nodes in the order their arcs follow each other from 12 o'clock.
 * @param flows - The flows between them, both ways and from a node to itself.
 * @param pad - The space between two arcs, in radians.
 */
export function chordLayout(
  nodes: readonly SankeyNode[],
  flows: readonly SankeyFlow[],
  pad = PAD,
): ChordLayout {
  const known = new Set(nodes.map((node) => node.key));
  const kept = flows.filter((flow) => counted(flow) && known.has(flow.from) && known.has(flow.to));
  const touched = new Set(kept.flatMap((flow) => [flow.from, flow.to]));
  const keys = [...known].filter((key) => touched.has(key));
  const total = kept.reduce((sum, flow) => sum + flow.value, 0);
  const gap = Math.min(pad, TAU / keys.length / 2);
  const { feet, groups } = arcsOf(keys, sumsOf(kept), {
    gap,
    unit: (TAU - gap * keys.length) / total,
  });

  return { groups, ribbons: ribbonsOf(keys, feet) };
}
