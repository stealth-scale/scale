import { describe, expect, it } from "vitest";

import { WORDS, wordsOf } from "#markdown/words.ts";

describe("words", () => {
  it.each([
    { kind: "caution", want: "Caution" },
    { kind: "important", want: "Important" },
    { kind: "note", want: "Note" },
    { kind: "tip", want: "Tip" },
    { kind: "warning", want: "Warning" },
  ])("titles a $kind callout $want", ({ kind, want }) => {
    expect(WORDS.calloutLabel(kind)).toBe(want);
  });

  it("titles a callout of another kind by its kind capitalised", () => {
    expect(WORDS.calloutLabel("danger")).toBe("Danger");
  });

  it("names a fence without a language Code", () => {
    expect(WORDS.codeLabel()).toBe("Code");
  });

  it("names a fence by its language", () => {
    expect(WORDS.codeLabel("ts")).toBe("Code, ts");
  });

  it("names the back link to a first reference by the footnote's number", () => {
    expect(WORDS.footnoteBackLabel(2, 1)).toBe("Back to reference 2");
  });

  it("names the back link to a later reference by the number and the reference", () => {
    expect(WORDS.footnoteBackLabel(2, 3)).toBe("Back to reference 2-3");
  });

  it("states a task's state in GitHub's words", () => {
    expect([WORDS.taskDoneLabel, WORDS.taskOpenLabel]).toStrictEqual([
      "Completed task",
      "Incomplete task",
    ]);
  });

  it("applies the caller's words over the defaults", () => {
    expect(wordsOf({ footnotesLabel: "Voetnoten" }).footnotesLabel).toBe("Voetnoten");
  });

  it("keeps a default the caller leaves out", () => {
    expect(wordsOf({ tableLabel: undefined }).tableLabel).toBe("Table");
  });
});
