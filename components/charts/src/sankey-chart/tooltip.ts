/**
 * Writes what a sankey's tooltip shows about the mark it is at: a node's name with its inflow and
 * outflow, or a flow's two names with its value and its share of what its source sends.
 *
 * @remarks
 *   A node's row that would read zero, a source's inflow or a sink's outflow, is left out. A share
 *   is written to two significant digits, as a hierarchy's is. The tooltip finds the mark by the
 *   name recharts reports.
 */

import { type TooltipEntry, type TooltipRow } from "#chart/tooltip.tsx";
import { type HierarchyWriters, type NodeTooltip } from "#hierarchy/facts.ts";
import { type Fact } from "#sankey-chart/graph.ts";

/**
 * Describes the words the tooltip's rows are named by.
 */
export interface FlowWords {
  /**
   * Name of what flows into a node.
   */
  readonly inflow: string;

  /**
   * Name of what flows out of a node.
   */
  readonly outflow: string;

  /**
   * Name of a flow's share of what its source sends.
   */
  readonly share: string;

  /**
   * Name of a flow's value.
   */
  readonly value: string;
}

/**
 * Words the tooltip's rows are named by unless stated.
 */
export const WORDS: FlowWords = {
  inflow: "In",
  outflow: "Out",
  share: "Of source",
  value: "Value",
};

/**
 * Describes what the tooltip reads: the facts by name, the words and the writers.
 */
export interface FlowFacts {
  /**
   * Facts the tooltip writes about each mark, by the name recharts reports.
   */
  readonly facts: ReadonlyMap<string, Fact>;

  /**
   * Words the rows are named by.
   */
  readonly words: FlowWords;

  /**
   * Functions that write the numbers.
   */
  readonly writers: HierarchyWriters;
}

/**
 * Returns a mark's rows: a flow's value and share, or a node's inflow and outflow above zero.
 */
function rowsOf(fact: Fact | undefined, read: FlowFacts): TooltipRow[] {
  const { words, writers } = read;

  if (fact === undefined) return [];

  if (fact.kind === "flow") {
    return [
      { key: "value", name: words.value, value: writers.formatValue(fact.value) },
      { key: "share", name: words.share, value: writers.formatRate(fact.share) },
    ];
  }

  const rows: TooltipRow[] = [];

  if (fact.inflow > 0) {
    rows.push({ key: "inflow", name: words.inflow, value: writers.formatValue(fact.inflow) });
  }

  if (fact.outflow > 0) {
    rows.push({ key: "outflow", name: words.outflow, value: writers.formatValue(fact.outflow) });
  }

  return rows;
}

/**
 * Returns the tooltip's heading and rows about the mark recharts reports, or none for entries that
 * name no mark.
 *
 * @param read - The facts, the words and the writers.
 */
export function tooltipOf(read: FlowFacts): NodeTooltip {
  /**
   * Returns the fact about the mark the tooltip's entries were read from.
   */
  const factOf = (entries: readonly TooltipEntry[]): Fact | undefined => {
    const name = entries[0]?.name;

    return typeof name === "string" ? read.facts.get(name) : undefined;
  };

  return {
    headingOf: (entries) => factOf(entries)?.title,
    rowsOf: (entries) => rowsOf(factOf(entries), read),
  };
}
