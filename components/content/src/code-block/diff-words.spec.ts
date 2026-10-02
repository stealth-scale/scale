import { describe, expect, it } from "vitest";

import { diffWordsOf, WORDS } from "#code-block/diff-words.ts";

describe("diffWordsOf", () => {
  it("returns the English words when the caller passes none", () => {
    expect(diffWordsOf({})).toStrictEqual(WORDS);
  });

  it("names a fold of one line in the singular", () => {
    expect(WORDS.expandLabel(1)).toBe("Show 1 unchanged line");
  });

  it("names a fold of several lines in the plural", () => {
    expect(WORDS.expandLabel(12)).toBe("Show 12 unchanged lines");
  });

  it("writes the counts of a diff in words", () => {
    expect(WORDS.statLabel({ added: 3, removed: 1 })).toBe("3 lines added, 1 line removed");
  });

  it("returns the caller's word over the default", () => {
    expect(diffWordsOf({ addedLabel: "Hinzugefügt" }).addedLabel).toBe("Hinzugefügt");
  });

  it("keeps the default where the caller's word is undefined", () => {
    expect(diffWordsOf({ removedLabel: undefined }).removedLabel).toBe("Removed");
  });
});
