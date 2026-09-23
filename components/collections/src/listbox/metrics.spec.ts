import { describe, expect, it } from "vitest";

import { aligned, banded, firstLine, PAD, ROW_HEIGHT, rowHeight, tiled } from "#listbox/metrics.ts";

describe("PAD", () => {
  it("is the smallest gap of the scale", () => {
    expect(PAD).toBe("{spacing.gap.xs}");
  });
});

describe("banded", () => {
  it("adds the list's own room to the room a row leaves at either end", () => {
    expect(banded("4px", "8px")).toStrictEqual({
      paddingInlineEnd: "calc({spacing.gap.xs} + 8px)",
      paddingInlineStart: "calc({spacing.gap.xs} + 4px)",
    });
  });
});

describe("aligned", () => {
  it("insets a part outside the list to where a row's first letter sits", () => {
    expect(aligned("4px")).toStrictEqual({
      paddingInlineStart: "calc({spacing.gap.xs} + 4px)",
    });
  });
});

describe("firstLine", () => {
  it("draws a square mark and stands it on the first line of the row", () => {
    expect(firstLine("16px")).toStrictEqual({
      blockSize: "16px",
      inlineSize: "16px",
      marginBlockStart: "calc((1lh - 16px) / 2)",
    });
  });
});

describe("rowHeight", () => {
  it("publishes the floor plus the room a row of that step keeps above and below", () => {
    expect(rowHeight("md")).toStrictEqual({
      [ROW_HEIGHT]:
        "calc({sizes.6} + calc({spacing.gap.sm} * var(--density, 1)) + calc({spacing.gap.sm} * var(--density, 1)))",
    });
  });
});

describe("tiled", () => {
  it("draws the list as a grid at every count the scale offers", () => {
    const counts = tiled();

    expect(Object.values(counts).every((each) => each["display"] === "grid")).toBe(true);
    expect(Object.keys(counts).length).toBeGreaterThan(1);
  });
});
