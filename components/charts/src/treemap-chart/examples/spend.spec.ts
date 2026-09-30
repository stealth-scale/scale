import { describe, expect, it } from "vitest";

import { hierarchyLeaves } from "#hierarchy/hierarchy.ts";
import { CREDITED, labelled, SPEND, STORAGE, TAIL } from "#treemap-chart/examples/spend.ts";

/**
 * Returns the sum of a hierarchy's leaves' values.
 */
function totalOf(parts: Parameters<typeof labelled>[0]): number {
  return hierarchyLeaves(labelled(parts, String)).reduce((sum, leaf) => sum + leaf.value, 0);
}

describe("spend", () => {
  it("totals the bill at 95400", () => {
    expect(totalOf(SPEND)).toBe(95_400);
  });

  it("makes Kubernetes and Postgres the two largest services", () => {
    expect(
      hierarchyLeaves(labelled(SPEND, String))
        .toSorted((first, second) => second.value - first.value)
        .slice(0, 2)
        .map((leaf) => leaf.key),
    ).toStrictEqual(["kubernetes", "postgres"]);
  });

  it("posts a credit below zero to the platform team", () => {
    expect(
      hierarchyLeaves(labelled(CREDITED, String))
        .filter((leaf) => leaf.value < 0)
        .map((leaf) => [leaf.group, leaf.value]),
    ).toStrictEqual([["platform", -6200]]);
  });

  it("totals the platform team's small services at 7595", () => {
    expect(totalOf(TAIL) - 48_000).toBe(7595);
  });

  it("totals the file share at 7465", () => {
    expect(totalOf(STORAGE)).toBe(7465);
  });

  it("names every part through the function", () => {
    expect(labelled(SPEND, (key) => key.toUpperCase())[0]?.children?.[0]?.label).toBe("POSTGRES");
  });

  it("leaves a part without parts without children", () => {
    expect(labelled(STORAGE, String)[0]?.children).toBeUndefined();
  });

  it("gives a part the palette the map states for its key", () => {
    expect(labelled(SPEND, String, { data: "teal" }).map((team) => team.color)).toStrictEqual([
      "teal",
      undefined,
      undefined,
    ]);
  });
});
