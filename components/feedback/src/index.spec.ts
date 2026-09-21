import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports only the four components and their two props providers", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Alert",
      "EmptyState",
      "Skeleton",
      "SkeletonPropsProvider",
      "SkeletonText",
      "SkeletonTextPropsProvider",
    ]);
  });

  it("groups a multi-slot component into a namespace keyed by slot name", () => {
    expect(Object.keys(barrel.Alert).toSorted()).toStrictEqual([
      "Aside",
      "Content",
      "Description",
      "Indicator",
      "LIVES",
      "Root",
      "Title",
    ]);
  });

  it("omits every export whose name starts with recipe with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
