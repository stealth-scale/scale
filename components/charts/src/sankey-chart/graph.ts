/**
 * Resolves a sankey's nodes and flows into recharts' data: the flows it renders, the nodes they
 * touch in the caller's order, each mark's place in the keyboard walk, and what the tooltip writes
 * about each mark.
 *
 * @remarks
 *   A flow is rendered between two known nodes with a finite value above zero that closes no loop,
 *   and flows between the same two nodes add up to one flow. The chart leaves out a node without a
 *   rendered flow, and keeps the first of two nodes with one key. The walk visits each node in the
 *   caller's order, then the flows it sends in theirs, and recharts receives the flows in that
 *   order. Recharts names a node in the tooltip by its `name`, which is its key here, and a flow by
 *   its two nodes' names joined by " - ", so the facts are keyed the same way.
 */

import { type ChartColor } from "#chart/colors.ts";
import { counted, sankeyCycles, type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";

/**
 * Describes one node as the chart renders it.
 */
export interface NodeView {
  /**
   * Palette the node states, if any.
   */
  readonly color: ChartColor | undefined;

  /**
   * Key of the node.
   */
  readonly key: string;

  /**
   * Whether the node sends no rendered flow, so recharts places it at the last column.
   */
  readonly sink: boolean;

  /**
   * Name written beside the node: its label, else its key.
   */
  readonly title: string;

  /**
   * Larger of the node's inflow and outflow, which its bar's height follows.
   */
  readonly value: number;

  /**
   * Place of the node in the keyboard walk.
   */
  readonly walk: number;
}

/**
 * Describes one flow as the chart renders it.
 */
export interface FlowView {
  /**
   * Key of the node the flow leaves, whose color the flow takes.
   */
  readonly from: string;

  /**
   * Key of the node the flow enters.
   */
  readonly to: string;

  /**
   * Place of the flow in the keyboard walk.
   */
  readonly walk: number;
}

/**
 * Describes what the tooltip writes about a node: its name, its inflow and its outflow.
 */
export interface NodeFact {
  /**
   * Sum of the rendered flows into the node.
   */
  readonly inflow: number;

  /**
   * Kind of mark the fact is about.
   */
  readonly kind: "node";

  /**
   * Sum of the rendered flows out of the node.
   */
  readonly outflow: number;

  /**
   * Name of the node.
   */
  readonly title: string;
}

/**
 * Describes what the tooltip writes about a flow: its two nodes' names, its value and its share of
 * what its source sends.
 */
export interface FlowFact {
  /**
   * Kind of mark the fact is about.
   */
  readonly kind: "flow";

  /**
   * Share of the source's outflow in the flow.
   */
  readonly share: number;

  /**
   * Heading of the flow: its two nodes' names, source first.
   */
  readonly title: string;

  /**
   * Value of the flow.
   */
  readonly value: number;
}

/**
 * Describes what the tooltip writes about a mark.
 */
export type Fact = FlowFact | NodeFact;

/**
 * Describes one link recharts lays out: its source's and its target's index and its value.
 */
export interface Link {
  /**
   * Index of the node the flow leaves.
   */
  source: number;

  /**
   * Index of the node the flow enters.
   */
  target: number;

  /**
   * Value of the flow, which the band's width follows.
   */
  value: number;
}

/**
 * Describes one node recharts lays out: the name it reports to the tooltip.
 */
export interface Named {
  /**
   * Key of the node, which recharts reports to the tooltip as the entry's name.
   */
  name: string;
}

/**
 * Describes the data recharts lays out: the nodes, and the links between them by index.
 */
export interface Laid {
  /**
   * Links in the walk's order.
   */
  readonly links: Link[];

  /**
   * Nodes in the caller's order.
   */
  readonly nodes: Named[];
}

/**
 * Describes a flow graph resolved for recharts.
 */
export interface Graph {
  /**
   * Nodes and links recharts lays out.
   */
  readonly data: Laid;

  /**
   * Facts the tooltip writes about each mark, by the name recharts reports.
   */
  readonly facts: Map<string, Fact>;

  /**
   * Flows in recharts' order.
   */
  readonly flows: FlowView[];

  /**
   * Nodes in recharts' order.
   */
  readonly nodes: NodeView[];
}

/**
 * Returns the name recharts reports for the flow between two nodes.
 */
export function nameOf(from: string, to: string): string {
  return `${from} - ${to}`;
}

/**
 * Returns the sum of the flows' values.
 */
function sumOf(flows: readonly SankeyFlow[]): number {
  return flows.reduce((sum, flow) => sum + flow.value, 0);
}

/**
 * Returns the flows recharts renders, in the order each pair of nodes first appears: the flows
 * between known nodes with a finite value above zero that close no loop, those between the same
 * two nodes added up.
 */
function drawnOf(nodes: readonly SankeyNode[], flows: readonly SankeyFlow[]): SankeyFlow[] {
  const known = new Set(nodes.map((node) => node.key));
  const kept = flows.filter((flow) => counted(flow) && known.has(flow.from) && known.has(flow.to));
  const looped = new Set(sankeyCycles(kept));
  const pairs = new Map<string, SankeyFlow>();

  for (const flow of kept.filter((each) => !looped.has(each))) {
    const name = nameOf(flow.from, flow.to);

    pairs.set(name, { ...flow, value: (pairs.get(name)?.value ?? 0) + flow.value });
  }

  return [...pairs.values()];
}

/**
 * Returns the nodes a flow touches in the caller's order, the first of two nodes with one key.
 */
function shownOf(nodes: readonly SankeyNode[], flows: readonly SankeyFlow[]): SankeyNode[] {
  const touched = new Set(flows.flatMap((flow) => [flow.from, flow.to]));

  return nodes.filter(
    (node, at) => touched.has(node.key) && nodes.findIndex((each) => each.key === node.key) === at,
  );
}

/**
 * Resolves the nodes and the flows into recharts' data, the marks' views and the tooltip's facts.
 *
 * @param nodes - The nodes in the caller's order.
 * @param flows - The flows between them.
 */
export function graphOf(nodes: readonly SankeyNode[], flows: readonly SankeyFlow[]): Graph {
  const drawn = drawnOf(nodes, flows);
  const shown = shownOf(nodes, drawn);
  const graph: Graph = { data: { links: [], nodes: [] }, facts: new Map(), flows: [], nodes: [] };

  /**
   * Returns the name of a shown node: its label, else its key.
   */
  const titleOf = (key: string): string => shown.find((node) => node.key === key)?.label ?? key;

  for (const [at, node] of shown.entries()) {
    const title = titleOf(node.key);
    const sent = drawn.filter((flow) => flow.from === node.key);
    const inflow = sumOf(drawn.filter((flow) => flow.to === node.key));
    const outflow = sumOf(sent);

    graph.facts.set(node.key, { inflow, kind: "node", outflow, title });
    graph.data.nodes.push({ name: node.key });
    graph.nodes.push({
      color: node.color,
      key: node.key,
      sink: outflow === 0,
      title,
      value: Math.max(inflow, outflow),
      walk: graph.nodes.length + graph.flows.length,
    });

    for (const flow of sent) {
      graph.facts.set(nameOf(flow.from, flow.to), {
        kind: "flow",
        share: flow.value / outflow,
        title: `${title} → ${titleOf(flow.to)}`,
        value: flow.value,
      });
      graph.data.links.push({
        source: at,
        target: shown.findIndex((each) => each.key === flow.to),
        value: flow.value,
      });
      graph.flows.push({
        from: flow.from,
        to: flow.to,
        walk: graph.nodes.length + graph.flows.length,
      });
    }
  }

  return graph;
}
