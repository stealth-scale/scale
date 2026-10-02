import { describe, expect, it } from "vitest";

import { hierarchyLeaves } from "#hierarchy/hierarchy.ts";
import { CREDITED, labelled, SPEND, STORAGE } from "#sunburst-chart/examples/spend.ts";

/**
 * Returns the sum of a hierarchy's leaves' values in one group, or in all of them.
 */
function totalOf(parts: Parameters<typeof labelled>[0], group?: string): number {
  return hierarchyLeaves(labelled(parts, String))
    .filter((leaf) => group === undefined || leaf.group === group)
    .reduce((sum, leaf) => sum + leaf.value, 0);
}

describe("spend", () => {
  it("totals the bill at 114500", () => {
    expect(totalOf(SPEND)).toBe(114_500);
  });

  it("totals the platform team at 68800", () => {
    expect(totalOf(SPEND, "platform")).toBe(68_800);
  });

  it("totals the product team at 25800", () => {
    expect(totalOf(SPEND, "product")).toBe(25_800);
  });

  it("makes virtual machines the largest resource", () => {
    expect(
      hierarchyLeaves(labelled(SPEND, String)).toSorted(
        (first, second) => second.value - first.value,
      )[0]?.key,
    ).toBe("vms");
  });

  it("nests the platform team three levels deep", () => {
    expect(labelled(SPEND, String)[0]?.children?.[0]?.children?.[0]?.key).toBe("vms");
  });

  it("posts a credit below zero to the data team", () => {
    expect(
      hierarchyLeaves(labelled(CREDITED, String))
        .filter((leaf) => leaf.value < 0)
        .map((leaf) => [leaf.group, leaf.value]),
    ).toStrictEqual([["data", -3000]]);
  });

  it("totals the file server at 6980", () => {
    expect(totalOf(STORAGE)).toBe(6980);
  });

  it("totals design and video at 4300", () => {
    expect(totalOf(STORAGE, "design") + totalOf(STORAGE, "video")).toBe(4300);
  });
});
