/**
 * Writes the facts a hierarchy chart's tooltip and marks show about a node: its name, its size and
 * its share of the nodes shown.
 *
 * @remarks
 *   A share in the tooltip is written to two significant digits, so a sliver's share is not written
 *   as 0%, and a share on a mark in whole percents, which fit a small mark. The tooltip finds the
 *   node by the key recharts reports as the entry's name.
 */

import { type ReactNode } from "react";

import { type TooltipEntry, type TooltipRow } from "#chart/tooltip.tsx";
import { type ChartApi } from "#chart/use-chart.ts";

/**
 * Options a share is written with in the tooltip: two significant digits.
 */
const RATES: Intl.NumberFormatOptions = { maximumSignificantDigits: 2, style: "percent" };

/**
 * Options a share is written with on a mark: whole percents.
 */
const SHARED: Intl.NumberFormatOptions = { maximumFractionDigits: 0, style: "percent" };

/**
 * Words the tooltip's rows are named by unless stated.
 */
export const WORDS: HierarchyWords = { share: "Of total", value: "Value" };

/**
 * Describes a node as the tooltip reads it: its name and its size.
 */
export interface NodeFacts {
  /**
   * Name of the node: its label, else its key.
   */
  readonly label: ReactNode;

  /**
   * Size of the node.
   */
  readonly size: number;
}

/**
 * Describes the words the tooltip's rows are named by.
 */
export interface HierarchyWords {
  /**
   * Name of a node's share of the nodes shown.
   */
  readonly share: string;

  /**
   * Name of a node's size.
   */
  readonly value: string;
}

/**
 * Describes the functions that write a node's numbers in the chart's locale.
 */
export interface HierarchyWriters {
  /**
   * Writes a share in the tooltip.
   */
  readonly formatRate: (value: unknown) => string;

  /**
   * Writes a share on a mark.
   */
  readonly formatShare: (value: unknown) => string;

  /**
   * Writes a size.
   */
  readonly formatValue: (value: unknown) => string;
}

/**
 * Describes what the tooltip reads: every node's facts by key, the total of the nodes shown, the
 * writers and the words.
 */
export interface Facts {
  /**
   * Name and size of each node shown, by key.
   */
  readonly facts: ReadonlyMap<string, NodeFacts>;

  /**
   * Sum of the top-level nodes' sizes.
   */
  readonly total: number;

  /**
   * Words the tooltip's rows are named by.
   */
  readonly words: HierarchyWords;

  /**
   * Functions that write the numbers.
   */
  readonly writers: HierarchyWriters;
}

/**
 * Describes the props the kit's tooltip takes about a node: its heading and its rows.
 */
export interface NodeTooltip {
  /**
   * Returns the node's name.
   */
  readonly headingOf: (entries: readonly TooltipEntry[]) => ReactNode;

  /**
   * Returns the node's size and share.
   */
  readonly rowsOf: (entries: readonly TooltipEntry[]) => TooltipRow[];
}

/**
 * Returns the writers of a node's size in `valueOptions` and of its share, in the chart's locale.
 *
 * @param chart - The chart whose locale the numbers are written in.
 * @param valueOptions - The `Intl.NumberFormat` options a size is written with.
 */
export function writersOf(
  chart: Pick<ChartApi, "formatNumber">,
  valueOptions: Intl.NumberFormatOptions | undefined,
): HierarchyWriters {
  return {
    formatRate: chart.formatNumber(RATES),
    formatShare: chart.formatNumber(SHARED),
    formatValue: chart.formatNumber(valueOptions),
  };
}

/**
 * Returns the tooltip's heading and rows: the node's name, and its size and share of the nodes
 * shown, or no row for entries that name no node.
 *
 * @param read - The facts, the total, the writers and the words.
 */
export function tooltipOf(read: Facts): NodeTooltip {
  const { facts, total, words, writers } = read;

  /**
   * Returns the node the tooltip's entries were read from.
   */
  const nodeOf = (entries: readonly TooltipEntry[]): NodeFacts | undefined => {
    const key = entries[0]?.name;

    return typeof key === "string" ? facts.get(key) : undefined;
  };

  return {
    headingOf: (entries) => nodeOf(entries)?.label,
    rowsOf: (entries) => {
      const node = nodeOf(entries);

      return node === undefined
        ? []
        : [
            { key: "value", name: words.value, value: writers.formatValue(node.size) },
            { key: "share", name: words.share, value: writers.formatRate(node.size / total) },
          ];
    },
  };
}
