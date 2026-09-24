import { describe, expect, it } from "vitest";

import { FOLDED, FOLDING, PRIORITY } from "#folding/folding.ts";

describe("FOLDING", () => {
  it("sets PRIORITY to data-priority", () => {
    expect(PRIORITY).toBe("data-priority");
  });

  it("keeps every action on one line at every width", () => {
    expect(FOLDING).toMatchObject({ whiteSpace: "nowrap" });
  });

  it("keeps a secondary action's words for a screen reader", () => {
    expect(FOLDING["&[data-priority=secondary]"]).toStrictEqual({
      "[data-narrow] &": {
        "& > :not(svg)": { srOnly: true },
        aspectRatio: "square",
        justifyContent: "center",
        paddingInline: "0",
      },
    });
  });

  it("renders a folded secondary action as a square around its icon", () => {
    expect(FOLDING["&[data-priority=secondary]"]["[data-narrow] &"]).toMatchObject({
      aspectRatio: "square",
      paddingInline: "0",
    });
  });

  it("takes a tertiary action out of the document rather than hiding it", () => {
    expect(FOLDING["&[data-priority=tertiary]"]).toStrictEqual({
      "[data-narrow] &": { display: "none" },
    });
  });

  it("sets nothing for a primary action", () => {
    expect(Object.keys(FOLDING).toSorted()).toStrictEqual([
      "&[data-priority=secondary]",
      "&[data-priority=tertiary]",
      "whiteSpace",
    ]);
  });

  it("folds nothing while the row is wide", () => {
    expect(Object.keys(FOLDING["&[data-priority=secondary]"])).toStrictEqual(["[data-narrow] &"]);
    expect(Object.keys(FOLDING["&[data-priority=tertiary]"])).toStrictEqual(["[data-narrow] &"]);
  });
});

describe("FOLDED", () => {
  it("shows the control only while the row is narrow", () => {
    expect(FOLDED).toStrictEqual({
      "[data-narrow] &": { display: "inline-flex" },
      display: "none",
    });
  });
});
