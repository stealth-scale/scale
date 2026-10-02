import { describe, expect, it } from "vitest";

import { CHIP_SIZES, chipSize } from "#chip.ts";

describe("chip", () => {
  it("lists sm md lg and xl smallest first", () => {
    expect(CHIP_SIZES).toStrictEqual(["sm", "md", "lg", "xl"]);
  });

  it("returns the tag height with gap-scale padding at md", () => {
    expect(chipSize("md")).toStrictEqual({
      gap: "calc({spacing.gap.xs} * var(--density, 1))",
      height: "calc({sizes.tag.md} * var(--density, 1))",
      paddingInline: "calc({spacing.gap.md} * var(--density, 1))",
      textStyle: "label.sm",
    });
  });

  it("widens the padding and the gap at xl", () => {
    expect(chipSize("xl")).toMatchObject({
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.gap.lg} * var(--density, 1))",
    });
  });
});
