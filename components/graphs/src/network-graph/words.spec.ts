import { describe, expect, it } from "vitest";

import { WORDS, wordsOf } from "#network-graph/words.ts";

describe("words", () => {
  it("returns the English words when the caller states none and nodes can be moved", () => {
    expect(wordsOf({}, true)).toStrictEqual(WORDS);
  });

  it("replaces a word the caller states", () => {
    expect(wordsOf({ clearLabel: "Show everything" }, true).clearLabel).toBe("Show everything");
  });

  it("keeps the default of a word the caller leaves undefined", () => {
    expect(wordsOf({ clearLabel: undefined }, true).clearLabel).toBe("Clear focus");
  });

  it("offers the arrow keys while nodes can be moved", () => {
    expect(wordsOf({}, true).nodeDescription).toBe(
      "Press Enter or Space to focus the node, the arrow keys to move it, and Escape to clear the focus.",
    );
  });

  it("offers no arrow key while nodes cannot be moved", () => {
    expect(wordsOf({}, false).nodeDescription).toBe(
      "Press Enter or Space to focus the node, and Escape to clear the focus.",
    );
  });

  it("keeps the caller's description while nodes cannot be moved", () => {
    expect(wordsOf({ nodeDescription: "Press Enter." }, false).nodeDescription).toBe(
      "Press Enter.",
    );
  });

  it("names a link by the names of its ends joined by and", () => {
    expect(WORDS.edgeName({ source: "Gateway", target: "Auth" })).toBe("Gateway and Auth");
  });

  it("writes the summary with one connection", () => {
    expect(WORDS.summary({ count: 1, name: "Fax" })).toBe("Fax: 1 connection");
  });

  it("writes the summary with several connections", () => {
    expect(WORDS.summary({ count: 3, name: "Checkout" })).toBe("Checkout: 3 connections");
  });

  it("writes the summary with no connection", () => {
    expect(WORDS.summary({ count: 0, name: "Fax" })).toBe("Fax: 0 connections");
  });

  it("announces a move by its direction", () => {
    expect(WORDS.moveAnnouncement({ direction: "left", x: 0, y: 0 })).toBe(
      "Moved the selected node left.",
    );
  });

  it.each([
    { key: "emptyLabel", word: "No nodes to show." },
    { key: "focusLabel", word: "Focus" },
    { key: "neighborLabel", word: "Connected" },
    { key: "promptLabel", word: "Select a node to show what it connects to." },
  ] as const)("defaults $key to $word", ({ key, word }) => {
    expect(WORDS[key]).toBe(word);
  });
});
