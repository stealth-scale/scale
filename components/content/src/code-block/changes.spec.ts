import { describe, expect, it } from "vitest";

import { changesOf, countsOf, type DiffLine, similarityOf } from "#code-block/changes.ts";
import { AFTER, BEFORE } from "#code-block/code-block.fixtures.tsx";

/**
 * Returns the text of a line's changed stretches.
 */
function changedOf(line: DiffLine | undefined): string {
  return (line?.runs ?? [])
    .filter((run) => run.changed)
    .map((run) => run.text)
    .join("");
}

describe("changes", () => {
  it("returns only context lines when both versions are the same", () => {
    expect(changesOf(BEFORE, BEFORE).map((line) => line.kind)).toStrictEqual(
      Array.from({ length: 12 }, () => "context"),
    );
  });

  it("numbers a kept line in both versions", () => {
    expect(changesOf("a\nb", "a\nb")[1]).toStrictEqual({
      after: 2,
      before: 2,
      kind: "context",
      runs: [{ changed: false, text: "b" }],
    });
  });

  it("writes a removed line before the added line that replaces it", () => {
    expect(changesOf(BEFORE, AFTER).map((line) => line.kind)).toStrictEqual([
      "context",
      "context",
      "removed",
      "added",
      "context",
      "context",
      "context",
      "context",
      "context",
      "removed",
      "added",
      "context",
      "context",
      "context",
    ]);
  });

  it("marks the word a line edited in place lost", () => {
    expect(changedOf(changesOf(BEFORE, AFTER)[2])).toBe("3");
  });

  it("marks the word a line edited in place gained", () => {
    expect(changedOf(changesOf(BEFORE, AFTER)[3])).toBe("5");
  });

  it("marks the words an edited line gained when it lost none", () => {
    expect(changedOf(changesOf(BEFORE, AFTER)[10])).toBe(" * 2 ** attempt");
  });

  it("keeps the whole text of an edited line in its stretches", () => {
    expect(
      changesOf(BEFORE, AFTER)[3]
        ?.runs.map((run) => run.text)
        .join(""),
    ).toBe("export async function retry(task, attempts = 5) {");
  });

  it("changes a replaced line as a whole when it shares too little with the new line", () => {
    expect(changesOf("return cached;", "throw new Error(message);")).toStrictEqual([
      { before: 1, kind: "removed", runs: [{ changed: false, text: "return cached;" }] },
      { after: 1, kind: "added", runs: [{ changed: false, text: "throw new Error(message);" }] },
    ]);
  });

  it("changes every line as a whole when a removal and the addition after it differ in length", () => {
    expect(changesOf("a\nb\nc", "a\nb x\ny\nc").slice(1, 4)).toStrictEqual([
      { before: 2, kind: "removed", runs: [{ changed: false, text: "b" }] },
      { after: 2, kind: "added", runs: [{ changed: false, text: "b x" }] },
      { after: 3, kind: "added", runs: [{ changed: false, text: "y" }] },
    ]);
  });

  it("writes a removal with no addition after it with the earlier number alone", () => {
    expect(changesOf("a\nb\nc", "a\nc")[1]).toStrictEqual({
      before: 2,
      kind: "removed",
      runs: [{ changed: false, text: "b" }],
    });
  });

  it("writes an addition with no removal before it with the later number alone", () => {
    expect(changesOf("a\nc", "a\nb\nc")[1]).toStrictEqual({
      after: 2,
      kind: "added",
      runs: [{ changed: false, text: "b" }],
    });
  });

  it("returns only context lines when the versions differ in the line break at the end", () => {
    expect(changesOf("a\nb\n", "a\nb").map((line) => line.kind)).toStrictEqual([
      "context",
      "context",
    ]);
  });

  it("keeps the line before a removed last line unchanged", () => {
    expect(changesOf("a\nb", "a").map((line) => line.kind)).toStrictEqual(["context", "removed"]);
  });

  it("numbers the lines after an addition one higher in the later version", () => {
    expect(changesOf("a\nc", "a\nb\nc")[2]).toMatchObject({ after: 3, before: 2 });
  });

  it("returns a similarity of 1 for two empty lines", () => {
    expect(similarityOf("", "")).toBe(1);
  });

  it("returns the share of the longer line two lines have in common as their similarity", () => {
    expect(similarityOf("attempts = 3", "attempts = 5")).toBeCloseTo(10 / 12);
  });

  it("returns a similarity under 0.35 for two unrelated lines", () => {
    expect(similarityOf("return cached;", "throw new Error(message);")).toBeLessThan(0.35);
  });

  it("counts the added lines and the removed lines of a diff", () => {
    expect(countsOf(changesOf("a\nb\nc", "a\nx\ny\nc"))).toStrictEqual({ added: 2, removed: 1 });
  });
});
