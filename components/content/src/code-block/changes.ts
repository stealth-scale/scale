/**
 * Derives the lines of a diff from two versions of a text: each line unchanged, removed or added,
 * with the words that changed inside a replaced line.
 *
 * @remarks
 *   A removal followed at once by an addition of the same number of lines replaces those lines, and
 *   each pair whose words overlap by at least 0.35 of the longer line marks the words that changed.
 *   A pair that overlaps less, and every other removal or addition, is changed as a whole, because
 *   the words two unrelated lines share are not edits. A line that differs only in the line break
 *   at the end of a version is unchanged. Line numbers count from 1 in each version.
 */

import { diffLines, diffWordsWithSpace } from "diff";

/**
 * Describes what happened to a line.
 */
export type DiffKind = "added" | "context" | "removed";

/**
 * Describes a stretch of a line's text, changed or kept.
 */
export interface DiffRun {
  /**
   * Whether the stretch changed inside a line that is otherwise kept.
   */
  readonly changed: boolean;

  /**
   * The stretch's text.
   */
  readonly text: string;
}

/**
 * Describes one line of a diff.
 */
export interface DiffLine {
  /**
   * Line number in the later version, absent for a removed line.
   */
  readonly after?: number | undefined;

  /**
   * Line number in the earlier version, absent for an added line.
   */
  readonly before?: number | undefined;

  /**
   * Kind of the line: added, removed, or kept in both versions.
   */
  readonly kind: DiffKind;

  /**
   * The line's text in stretches, one stretch for a line changed or kept as a whole.
   */
  readonly runs: readonly DiffRun[];
}

/**
 * Describes the stretches of a replaced run of lines, per line on each side.
 */
interface Replaced {
  /**
   * Stretches of each added line.
   */
  readonly added: readonly DiffRun[][];

  /**
   * Stretches of each removed line.
   */
  readonly removed: readonly DiffRun[][];
}

/**
 * Least share of the longer line two lines have in common to count as one line edited.
 */
const RELATED = 0.35;

/**
 * Returns the lines of a part of a diff, without the break after the last.
 */
function linesOf(value: string): string[] {
  return value.replace(/\n$/u, "").split("\n");
}

/**
 * Returns the share of the longer of two lines that the two have in common, from 0 to 1.
 */
export function similarityOf(first: string, second: string): number {
  const longest = Math.max(first.length, second.length);

  if (longest === 0) return 1;

  const shared = diffWordsWithSpace(first, second)
    .filter((part) => !part.added && !part.removed)
    .reduce((total, part) => total + part.value.trim().length, 0);

  return shared / longest;
}

/**
 * Returns the stretches of a removed and an added line: the words each changed, or each line whole.
 */
function pairOf(removed: string, added: string): [DiffRun[], DiffRun[]] {
  if (similarityOf(removed, added) < RELATED) {
    return [[{ changed: false, text: removed }], [{ changed: false, text: added }]];
  }

  const parts = diffWordsWithSpace(removed, added);

  return [
    parts
      .filter((part) => !part.added)
      .map((part) => ({ changed: part.removed, text: part.value })),
    parts
      .filter((part) => !part.removed)
      .map((part) => ({ changed: part.added, text: part.value })),
  ];
}

/**
 * Returns the stretches of a run of removed lines and the run of added lines after it: word
 * stretches where the runs pair up, and whole lines otherwise.
 */
function replacedOf(removed: readonly string[], added: readonly string[]): Replaced {
  if (removed.length !== added.length) {
    return {
      added: added.map((text) => [{ changed: false, text }]),
      removed: removed.map((text) => [{ changed: false, text }]),
    };
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The two runs have the same length.
  const pairs = removed.map((text, index) => pairOf(text, added[index] as string));

  return { added: pairs.map(([, after]) => after), removed: pairs.map(([before]) => before) };
}

/**
 * Describes the lines of a diff as they are written, with the last number of each version.
 */
interface Writing {
  /**
   * Last line number written in the earlier version.
   */
  earlier: number;

  /**
   * Last line number written in the later version.
   */
  later: number;

  /**
   * The lines written so far.
   */
  readonly lines: DiffLine[];
}

/**
 * Describes how many lines a diff adds and removes.
 */
export interface DiffCounts {
  /**
   * Number of added lines.
   */
  readonly added: number;

  /**
   * Number of removed lines.
   */
  readonly removed: number;
}

/**
 * Writes the lines both versions keep.
 */
function keep(writing: Writing, value: string): void {
  for (const text of linesOf(value)) {
    writing.earlier += 1;
    writing.later += 1;
    writing.lines.push({
      after: writing.later,
      before: writing.earlier,
      kind: "context",
      runs: [{ changed: false, text }],
    });
  }
}

/**
 * Writes a run of removed lines and the run of added lines after it.
 */
function change(writing: Writing, removed: readonly string[], added: readonly string[]): void {
  const runs = replacedOf(removed, added);

  for (const stretches of runs.removed) {
    writing.earlier += 1;
    writing.lines.push({ before: writing.earlier, kind: "removed", runs: stretches });
  }

  for (const stretches of runs.added) {
    writing.later += 1;
    writing.lines.push({ after: writing.later, kind: "added", runs: stretches });
  }
}

/**
 * Returns the lines of a diff from the earlier version of a text to the later one.
 *
 * @param before - The earlier version.
 * @param after - The later version.
 */
export function changesOf(before: string, after: string): DiffLine[] {
  const writing: Writing = { earlier: 0, later: 0, lines: [] };
  const parts = diffLines(before, after, { ignoreNewlineAtEof: true });

  for (let index = 0; index < parts.length; index += 1) {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The index is inside the parts.
    const part = parts[index] as (typeof parts)[number];
    const next = parts[index + 1];

    if (!part.added && !part.removed) keep(writing, part.value);
    else if (part.added) change(writing, [], linesOf(part.value));
    else if (next?.added === true) {
      change(writing, linesOf(part.value), linesOf(next.value));
      index += 1;
    } else change(writing, linesOf(part.value), []);
  }

  return writing.lines;
}

/**
 * Returns how many lines a diff adds and removes.
 */
export function countsOf(lines: readonly DiffLine[]): DiffCounts {
  return {
    added: lines.filter((line) => line.kind === "added").length,
    removed: lines.filter((line) => line.kind === "removed").length,
  };
}
