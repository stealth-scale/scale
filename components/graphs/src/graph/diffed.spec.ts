import { renderHook } from "@testing-library/react";
import { type Edge } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { type GraphDiff } from "#diff/diff.ts";
import { diffedOf, markedEdges, useNodeChange, wordOf } from "#graph/diffed.ts";

const DIFF: GraphDiff = {
  edges: [
    { change: "added", fields: [], id: "draft-judge", label: "Draft to Judge" },
    { change: "unchanged", fields: [], id: "guard-draft", label: "Guard to Draft" },
  ],
  nodes: [
    { change: "added", fields: [], id: "judge", label: "Judge" },
    { change: "changed", fields: ["model"], id: "draft", label: "Draft" },
  ],
};

const JUDGED: Edge = { id: "draft-judge", source: "draft", target: "judge" };

const OTHER: Edge = { id: "judge-publish", source: "judge", target: "publish" };

function diffedFor(diff: GraphDiff): NonNullable<ReturnType<typeof diffedOf>> {
  const diffed = diffedOf(diff, {});

  if (diffed === undefined) throw new Error("A comparison marks changes.");

  return diffed;
}

describe("diffed", () => {
  it.each([
    { change: "added", want: "Added" },
    { change: "changed", want: "Changed" },
    { change: "removed", want: "Removed" },
  ] as const)("returns $want for a $change change unless stated", ({ change, want }) => {
    expect(wordOf(change, {})).toBe(want);
  });

  it.each([
    { change: "added", want: "Neu" },
    { change: "changed", want: "Geändert" },
    { change: "removed", want: "Entfernt" },
  ] as const)("returns the caller's word $want for a $change change", ({ change, want }) => {
    const words = { addedLabel: "Neu", changedLabel: "Geändert", removedLabel: "Entfernt" };

    expect(wordOf(change, words)).toBe(want);
  });

  it("returns no word for an unchanged node", () => {
    expect(wordOf("unchanged", {})).toBeUndefined();
  });

  it("returns no word without a change", () => {
    expect(wordOf(undefined, {})).toBeUndefined();
  });

  it("returns no changes without a comparison", () => {
    expect(diffedOf(undefined, {})).toBeUndefined();
  });

  it("maps each node's change by its id", () => {
    expect([...diffedFor(DIFF).nodes]).toStrictEqual([
      ["judge", "added"],
      ["draft", "changed"],
    ]);
  });

  it("maps each edge's change by its id", () => {
    expect([...diffedFor(DIFF).edges]).toStrictEqual([
      ["draft-judge", "added"],
      ["guard-draft", "unchanged"],
    ]);
  });

  it("keeps the words it is given", () => {
    expect(diffedOf(DIFF, { addedLabel: "Neu" })?.words).toStrictEqual({ addedLabel: "Neu" });
  });

  it("marks an edge the comparison lists with data-change", () => {
    expect(markedEdges([JUDGED], diffedFor(DIFF))[0]?.domAttributes).toStrictEqual({
      "data-change": "added",
    });
  });

  it("keeps an edge the comparison does not list", () => {
    expect(markedEdges([OTHER], diffedFor(DIFF))[0]).toBe(OTHER);
  });

  it("keeps the edge's own attributes beside its mark", () => {
    const edge: Edge = { ...JUDGED, domAttributes: { "aria-describedby": "note" } };

    expect(markedEdges([edge], diffedFor(DIFF))[0]?.domAttributes).toStrictEqual({
      "aria-describedby": "note",
      "data-change": "added",
    });
  });

  it("returns the same copy of an edge while its change is the same", () => {
    const diffed = diffedFor(DIFF);

    expect(markedEdges([JUDGED], diffed)[0]).toBe(markedEdges([JUDGED], diffed)[0]);
  });

  it("makes a new copy of an edge whose change changed", () => {
    const edge: Edge = { ...JUDGED };
    const first = markedEdges([edge], diffedFor(DIFF))[0];
    const removed = diffedFor({
      edges: [{ change: "removed", fields: [], id: "draft-judge", label: "Draft to Judge" }],
      nodes: [],
    });

    expect(markedEdges([edge], removed)[0]?.domAttributes).not.toStrictEqual(first?.domAttributes);
  });

  it("returns no change outside a node", () => {
    expect(renderHook(() => useNodeChange()).result.current).toBeUndefined();
  });
});
