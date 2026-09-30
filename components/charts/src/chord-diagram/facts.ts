/**
 * Writes the heading and the rows of a chord diagram's readout. An arc's readout names its node and
 * writes what the node sends and receives. A ribbon's readout names its two nodes and writes each
 * direction between them.
 *
 * @remarks
 *   A direction of 0 keeps its row, because a pair that flows one way is a finding. A ribbon
 *   between two nodes is headed by both names, and a node's flow to itself by its name.
 */

import { type TooltipRow } from "#chart/tooltip.tsx";
import { type Mark } from "#chord-diagram/marks.ts";
import { type FlowWords } from "#sankey-chart/tooltip.ts";

/**
 * Describes what the readout writes about a mark: its heading and its rows.
 */
export interface Readout {
  /**
   * Name of the mark: an arc's node, or a ribbon's two nodes.
   */
  readonly heading: string;

  /**
   * Amounts written about the mark, each with its name.
   */
  readonly rows: readonly TooltipRow[];
}

/**
 * Describes the words the readout's rows about an arc are named by.
 */
export type ChordWords = Pick<FlowWords, "inflow" | "outflow">;

/**
 * Returns what the readout writes about a mark.
 *
 * @param mark - The arc or the ribbon the readout is at.
 * @param words - The names of what a node sends and receives.
 * @param write - Writes an amount in the chart's locale.
 */
export function readoutOf(
  mark: Mark,
  words: ChordWords,
  write: (value: unknown) => string,
): Readout {
  if (mark.kind === "arc") {
    return {
      heading: mark.title,
      rows: [
        { key: "outflow", name: words.outflow, value: write(mark.group.value) },
        { key: "inflow", name: words.inflow, value: write(mark.inflow) },
      ],
    };
  }

  const [from, to] = mark.titles;
  const { source, target } = mark.ribbon;

  if (source.key === target.key) {
    return {
      heading: from,
      rows: [{ key: "forward", name: `${from} → ${from}`, value: write(source.value) }],
    };
  }

  return {
    heading: `${from} ⇄ ${to}`,
    rows: [
      { key: "forward", name: `${from} → ${to}`, value: write(source.value) },
      { key: "backward", name: `${to} → ${from}`, value: write(target.value) },
    ],
  };
}
