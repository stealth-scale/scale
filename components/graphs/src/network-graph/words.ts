/**
 * Writes the words a network graph renders, from the caller's words and the English defaults.
 *
 * @remarks
 *   A caller that states a word replaces the default and keeps every other default. A link names
 *   its ends with "and", because a link reads the same either way round. The description offers
 *   the arrow keys only while nodes can be moved.
 */

import { omitUndefined } from "@stealthscale/hooks";

import { type EdgeEnds } from "#graph/names.ts";
import { moveAnnouncementOf } from "#graph/words.ts";
import { type Connections, type NetworkWords } from "#network-graph/types.ts";

/**
 * Describes every word a network graph renders, each stated.
 */
export type Words = {
  readonly [Key in keyof NetworkWords]-?: Exclude<NetworkWords[Key], undefined>;
};

/**
 * Instruction every node is described by while nodes can be moved, unless stated.
 */
const MOVABLE =
  "Press Enter or Space to focus the node, the arrow keys to move it, and Escape to clear the focus.";

/**
 * Instruction every node is described by while nodes cannot be moved, unless stated.
 */
const FIXED = "Press Enter or Space to focus the node, and Escape to clear the focus.";

/**
 * Writes the name of a link from the names of its ends, unless stated.
 */
function linked({ source, target }: EdgeEnds): string {
  return `${source} and ${target}`;
}

/**
 * Writes the summary of a focus, unless stated.
 */
function counted({ count, name }: Connections): string {
  return `${name}: ${String(count)} ${count === 1 ? "connection" : "connections"}`;
}

/**
 * English words of a network graph whose nodes can be moved.
 */
export const WORDS: Words = {
  clearLabel: "Clear focus",
  edgeName: linked,
  emptyLabel: "No nodes to show.",
  focusLabel: "Focus",
  moveAnnouncement: moveAnnouncementOf,
  neighborLabel: "Connected",
  nodeDescription: MOVABLE,
  promptLabel: "Select a node to show what it connects to.",
  summary: counted,
};

/**
 * Returns the caller's words over the English defaults.
 *
 * @param words - The words the caller states.
 * @param draggable - Whether a person can move the nodes, which the default description offers.
 */
export function wordsOf(words: NetworkWords, draggable: boolean): Words {
  return { ...WORDS, nodeDescription: draggable ? MOVABLE : FIXED, ...omitUndefined(words) };
}
