import { describe, expect, it } from "vitest";

import { WORDS, wordsOf } from "#directed-graph/words.ts";

describe("words", () => {
  it("returns the English words when the caller states none", () => {
    expect(wordsOf({})).toStrictEqual(WORDS);
  });

  it("replaces a word the caller states", () => {
    expect(wordsOf({ clearLabel: "Show everything" }).clearLabel).toBe("Show everything");
  });

  it("keeps the default of a word the caller leaves undefined", () => {
    expect(wordsOf({ clearLabel: undefined }).clearLabel).toBe("Clear focus");
  });

  it("writes the control that closes a branch with the number it hides", () => {
    expect(WORDS.collapseLabel(5)).toBe("Hide 5");
  });

  it("writes the control that opens a branch with the number it shows", () => {
    expect(WORDS.expandLabel(5)).toBe("Show 5");
  });

  it("writes the summary with the focused node's name and both counts", () => {
    expect(WORDS.summary({ downstream: 2, name: "Revenue", upstream: 3 })).toBe(
      "Revenue: 3 upstream, 2 downstream",
    );
  });

  it("names an edge by the names of its ends", () => {
    expect(WORDS.edgeName({ source: "Orders", target: "Revenue" })).toBe("Orders to Revenue");
  });

  it.each([
    { key: "downstreamLabel", word: "Downstream" },
    { key: "emptyLabel", word: "No nodes to show." },
    { key: "focusLabel", word: "Focus" },
    { key: "upstreamLabel", word: "Upstream" },
  ] as const)("defaults $key to $word", ({ key, word }) => {
    expect(WORDS[key]).toBe(word);
  });

  it("describes the keys that trace a node", () => {
    expect(WORDS.nodeDescription).toBe(
      "Press Enter or Space to trace the node, and Escape to clear the trace.",
    );
  });

  it("prompts for a node while nothing is focused", () => {
    expect(WORDS.promptLabel).toBe("Select a node to trace what feeds it and what it feeds.");
  });
});
