import { describe, expect, it } from "vitest";

import { aligned, banded, PAD, ROW_HEIGHT, rowHeight, tiled } from "#listbox/metrics.ts";

describe("PAD", () => {
  it("reads the xs gap", () => {
    expect(PAD).toBe("{spacing.gap.xs}");
  });
});

describe("banded", () => {
  it("adds the list's padding to each inset", () => {
    expect(banded("4px", "8px")).toStrictEqual({
      paddingInlineEnd: "calc({spacing.gap.xs} + 8px)",
      paddingInlineStart: "calc({spacing.gap.xs} + 4px)",
    });
  });
});

describe("aligned", () => {
  it("adds the list's padding to the start inset", () => {
    expect(aligned("4px")).toStrictEqual({
      paddingInlineStart: "calc({spacing.gap.xs} + 4px)",
    });
  });
});

describe("rowHeight", () => {
  it("returns the row floor plus the block padding at both ends", () => {
    expect(rowHeight("md")).toStrictEqual({
      [ROW_HEIGHT]:
        "calc({sizes.6} + calc({spacing.gap.sm} * var(--density, 1)) + calc({spacing.gap.sm} * var(--density, 1)))",
    });
  });
});

describe("tiled", () => {
  it("sets display grid on every column count", () => {
    expect(Object.values(tiled()).every((each) => each["display"] === "grid")).toBe(true);
  });

  it("returns more than one column count", () => {
    expect(Object.keys(tiled()).length).toBeGreaterThan(1);
  });
});
