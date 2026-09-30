import { describe, expect, it } from "vitest";

import { DIFF } from "#code-block/diff-styles.ts";

describe("DIFF", () => {
  it("styles the ten slots of a diff", () => {
    expect(Object.keys(DIFF).toSorted()).toStrictEqual([
      "change",
      "diff",
      "empty",
      "filler",
      "fold",
      "line",
      "mark",
      "number",
      "stat",
      "text",
    ]);
  });

  it("tints an added line in the success palette", () => {
    expect(DIFF.line["&[data-kind=added]"]).toStrictEqual({
      background: "colorPalette.subtle",
      colorPalette: "success",
    });
  });

  it("tints a removed line in the error palette", () => {
    expect(DIFF.line["&[data-kind=removed]"]).toStrictEqual({
      background: "colorPalette.subtle",
      colorPalette: "error",
    });
  });

  it("underlines a changed word under forced colors", () => {
    expect(DIFF.change).toMatchObject({ _highContrast: { textDecorationLine: "underline" } });
  });

  it.each(["mark", "number"] as const)("keeps the %s slot out of a selection", (slot) => {
    expect(DIFF[slot]).toMatchObject({ userSelect: "none" });
  });

  it("puts the two versions in two columns side by side", () => {
    expect(DIFF.diff["&[data-mode=split]"]).toStrictEqual({
      gridTemplateColumns: "repeat(2, minmax(max-content, 1fr))",
    });
  });

  it("spans a fold across both columns", () => {
    expect(DIFF.fold).toMatchObject({ gridColumn: "1 / -1" });
  });

  it("rings a focused line inside its box", () => {
    expect(DIFF.line).toMatchObject({ focusVisibleRing: "inside" });
  });
});
