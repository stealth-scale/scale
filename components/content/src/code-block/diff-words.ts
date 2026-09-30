/**
 * Writes the words a code block's diff gives a screen reader and its folds, each a prop with an
 * English default.
 *
 * @remarks
 *   A changed line states what happened to it in words before its text, because its tint and its
 *   `+` or `−` mark are hidden from a screen reader and a tint alone fails WCAG 1.4.1. A fold names
 *   how many lines it hides. The counts in the header state the lines added and removed.
 */

import { omitUndefined } from "@stealthscale/hooks";

import { type DiffCounts } from "#code-block/changes.ts";

/**
 * Describes the words of a diff, each with an English default.
 */
export interface DiffWords {
  /**
   * Words a screen reader hears before an added line.
   */
  readonly addedLabel?: string | undefined;

  /**
   * Words the diff renders where both versions are the same.
   */
  readonly emptyLabel?: string | undefined;

  /**
   * Writes the name of a fold from the number of lines it hides.
   */
  readonly expandLabel?: ((count: number) => string) | undefined;

  /**
   * Words a screen reader hears before a removed line.
   */
  readonly removedLabel?: string | undefined;

  /**
   * Writes the counts of a diff in words.
   */
  readonly statLabel?: ((counts: DiffCounts) => string) | undefined;
}

/**
 * Describes the words with every default applied.
 */
export type Words = Required<{ [Key in keyof DiffWords]: NonNullable<DiffWords[Key]> }>;

/**
 * Writes a count of lines: "1 line" or "3 lines".
 */
function linesOf(count: number): string {
  return count === 1 ? "1 line" : `${String(count)} lines`;
}

/**
 * Lists the English words.
 */
export const WORDS: Words = {
  addedLabel: "Added",
  emptyLabel: "No changes",
  expandLabel: (count) =>
    count === 1 ? "Show 1 unchanged line" : `Show ${String(count)} unchanged lines`,
  removedLabel: "Removed",
  statLabel: ({ added, removed }) => `${linesOf(added)} added, ${linesOf(removed)} removed`,
};

/**
 * Returns the caller's words over the English defaults.
 *
 * @param words - The caller's words, any of which may be absent.
 */
export function diffWordsOf(words: DiffWords): Words {
  return { ...WORDS, ...omitUndefined(words) };
}
