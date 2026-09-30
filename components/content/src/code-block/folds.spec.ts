import { describe, expect, it } from "vitest";

import { changesOf } from "#code-block/changes.ts";
import { AFTER, BEFORE } from "#code-block/code-block.fixtures.tsx";
import { isFold, pairsOf, type Shown, shownOf } from "#code-block/folds.ts";

/**
 * Lines of the retry helper's diff: fourteen lines, changed at 2, 3, 9 and 10.
 */
const LINES = changesOf(BEFORE, AFTER);

/**
 * Writes each row as a fold's start and count, or a line's kind and numbers.
 */
function rowsOf(rows: readonly Shown[]): string[] {
  return rows.map((row) =>
    isFold(row)
      ? `fold ${String(row.start)}+${String(row.count)}`
      : `${row.kind} ${String(row.before ?? "-")}/${String(row.after ?? "-")}`,
  );
}

/**
 * Writes a pair as the kinds of its two sides, with a dash for an absent side.
 */
function sidesOf(pair: ReturnType<typeof pairsOf>[number]): string {
  if (isFold(pair)) return `fold ${String(pair.start)}`;

  return `${pair.before?.kind ?? "-"}|${pair.after?.kind ?? "-"}`;
}

describe("folds", () => {
  it("shows every line when context is Infinity", () => {
    expect(shownOf(LINES, Infinity, new Set())).toStrictEqual(LINES);
  });

  it("folds each run of unchanged lines more than context lines from a change", () => {
    expect(rowsOf(shownOf(LINES, 1, new Set()))).toStrictEqual([
      "fold 0+1",
      "context 2/2",
      "removed 3/-",
      "added -/3",
      "context 4/4",
      "fold 5+3",
      "context 8/8",
      "removed 9/-",
      "added -/9",
      "context 10/10",
      "fold 12+2",
    ]);
  });

  it("folds no line of the retry diff at a context of 3", () => {
    expect(shownOf(LINES, 3, new Set()).some((row) => isFold(row))).toBe(false);
  });

  it("folds every line of a diff without changes into one fold", () => {
    expect(shownOf(changesOf(BEFORE, BEFORE), 3, new Set())).toStrictEqual([
      { count: 12, start: 0 },
    ]);
  });

  it("shows the lines of an open fold in place of the fold", () => {
    expect(rowsOf(shownOf(LINES, 1, new Set([5]))).slice(5, 9)).toStrictEqual([
      "context 5/5",
      "context 6/6",
      "context 7/7",
      "context 8/8",
    ]);
  });

  it("keeps a fold that is not open when another opens", () => {
    expect(rowsOf(shownOf(LINES, 1, new Set([5]))).at(-1)).toBe("fold 12+2");
  });

  it("pairs each removed line with the added line at the same place", () => {
    expect(pairsOf(shownOf(LINES, 1, new Set())).map((pair) => sidesOf(pair))).toStrictEqual([
      "fold 0",
      "context|context",
      "removed|added",
      "context|context",
      "fold 5",
      "context|context",
      "removed|added",
      "context|context",
      "fold 12",
    ]);
  });

  it("pairs an unchanged line with itself", () => {
    const [, pair] = pairsOf(shownOf(LINES, 1, new Set()));

    expect(pair).toStrictEqual({ after: LINES[1], before: LINES[1] });
  });

  it("pads the shorter side of a change with an absent line", () => {
    const lines = changesOf("a\nb\nc", "a\nx\ny\nc");

    expect(pairsOf(lines).map((pair) => sidesOf(pair))).toStrictEqual([
      "context|context",
      "removed|added",
      "-|added",
      "context|context",
    ]);
  });

  it("writes the pairs of a change that ends the diff", () => {
    expect(pairsOf(changesOf("a\nb", "a")).map((pair) => sidesOf(pair))).toStrictEqual([
      "context|context",
      "removed|-",
    ]);
  });

  it("returns true from isFold for a fold", () => {
    expect(isFold({ count: 2, start: 4 })).toBe(true);
  });

  it("returns false from isFold for a line", () => {
    expect(isFold({ kind: "context", runs: [] })).toBe(false);
  });
});
