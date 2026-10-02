/**
 * Writes the words a directed graph renders, from the caller's words and the English defaults.
 *
 * @remarks
 *   A caller that states a word replaces the default and keeps every other default. The counts of
 *   a branch control are the nodes the press hides or shows, so the words name no kind of node and
 *   suit a lineage and an org chart alike.
 */

import { omitUndefined } from "@stealthscale/hooks";

import { type Counts, type DirectedWords } from "#directed-graph/types.ts";
import { edgeNameOf } from "#graph/words.ts";

/**
 * Describes every word a directed graph renders, each stated.
 */
export type Words = {
  readonly [Key in keyof DirectedWords]-?: Exclude<DirectedWords[Key], undefined>;
};

/**
 * Writes the words of a control that closes a branch, unless stated.
 */
function hidden(count: number): string {
  return `Hide ${String(count)}`;
}

/**
 * Writes the words of a control that opens a branch, unless stated.
 */
function shown(count: number): string {
  return `Show ${String(count)}`;
}

/**
 * Writes the summary of a trace, unless stated.
 */
function summarised({ downstream, name, upstream }: Counts): string {
  return `${name}: ${String(upstream)} upstream, ${String(downstream)} downstream`;
}

/**
 * English words of a directed graph.
 */
export const WORDS: Words = {
  clearLabel: "Clear focus",
  collapseLabel: hidden,
  downstreamLabel: "Downstream",
  edgeName: edgeNameOf,
  emptyLabel: "No nodes to show.",
  expandLabel: shown,
  focusLabel: "Focus",
  nodeDescription: "Press Enter or Space to trace the node, and Escape to clear the trace.",
  promptLabel: "Select a node to trace what feeds it and what it feeds.",
  summary: summarised,
  upstreamLabel: "Upstream",
};

/**
 * Returns the caller's words over the English defaults.
 *
 * @param words - The words the caller states.
 */
export function wordsOf(words: DirectedWords): Words {
  return { ...WORDS, ...omitUndefined(words) };
}
