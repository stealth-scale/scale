/**
 * Describes a flow graph as a sankey chart takes it, nodes by key and flows between them, and
 * returns the flows that close a loop and each node's balance.
 *
 * @remarks
 *   A sankey shows flow in one direction, so a flow that closes a loop has no place in it: recharts
 *   throws on a loop that a source leads into and renders no path for one without a source. The
 *   chart leaves out every flow `sankeyCycles` returns. `flowBalance` is the conservation check: a
 *   node that sends more than it receives creates flow from nothing, and one that sends less loses
 *   flow the chart does not show. A flow counts only with a finite value above zero.
 */

import { type ChartColor } from "#chart/colors.ts";

/**
 * Describes one node of a flow graph: its key, its name and its color.
 */
export interface SankeyNode {
  /**
   * Palette of the node and of the flows it sends. The theme's series color at the node's place
   * unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Key the flows name the node by.
   */
  readonly key: string;

  /**
   * Name written beside the node and in the tooltip. The key unless stated.
   */
  readonly label?: string | undefined;
}

/**
 * Describes one flow of a flow graph: `value` moves from the node keyed `from` to the node keyed
 * `to`.
 */
export interface SankeyFlow {
  /**
   * Key of the node the flow leaves.
   */
  readonly from: string;

  /**
   * Key of the node the flow enters.
   */
  readonly to: string;

  /**
   * Amount that flows, such as a count of people or of money.
   */
  readonly value: number;
}

/**
 * Describes a node's balance: everything that flows into it and out of it.
 */
export interface SankeyBalance {
  /**
   * Sum of the flows into the node, 0 for a source.
   */
  readonly inflow: number;

  /**
   * Key of the node.
   */
  readonly key: string;

  /**
   * Sum of the flows out of the node, 0 for a sink.
   */
  readonly outflow: number;
}

/**
 * Returns whether a flow has a finite value above zero.
 */
export function counted(flow: SankeyFlow): boolean {
  return Number.isFinite(flow.value) && flow.value > 0;
}

/**
 * Returns the flows that close a loop against the flows before them, in their order: each flow
 * with a finite value above zero whose end already leads back to its start, a flow from a node to
 * itself included.
 *
 * @remarks
 *   The flows are taken in order, so the flows left after removing the ones returned always render.
 * @param flows - The flows in the order they are stated.
 */
export function sankeyCycles(flows: readonly SankeyFlow[]): SankeyFlow[] {
  const forward = new Map<string, Set<string>>();

  /**
   * Returns whether the flows taken so far lead from one node to another.
   */
  const leads = (from: string, to: string, seen: Set<string>): boolean => {
    if (from === to) return true;
    if (seen.has(from)) return false;

    seen.add(from);

    return [...(forward.get(from) ?? [])].some((next) => leads(next, to, seen));
  };
  const cycles: SankeyFlow[] = [];

  for (const flow of flows.filter((each) => counted(each))) {
    if (leads(flow.to, flow.from, new Set())) cycles.push(flow);
    else forward.set(flow.from, (forward.get(flow.from) ?? new Set()).add(flow.to));
  }

  return cycles;
}

/**
 * Returns each node's inflow and outflow over the flows with a finite value above zero between
 * two of the nodes, in the nodes' order.
 *
 * @param nodes - The nodes, whose keys the flows name.
 * @param flows - The flows between them.
 */
export function flowBalance(
  nodes: readonly SankeyNode[],
  flows: readonly SankeyFlow[],
): SankeyBalance[] {
  const balances = new Map(nodes.map((node) => [node.key, { inflow: 0, outflow: 0 }]));

  for (const flow of flows.filter((each) => counted(each))) {
    const source = balances.get(flow.from);
    const target = balances.get(flow.to);

    if (source === undefined || target === undefined) continue;

    source.outflow += flow.value;
    target.inflow += flow.value;
  }

  return [...balances].map(([key, { inflow, outflow }]) => ({ inflow, key, outflow }));
}
