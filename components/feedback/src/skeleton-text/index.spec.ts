import { describe, expect, it } from "vitest";

import * as barrel from "#skeleton-text/index.ts";

describe("index", () => {
  it("exports SkeletonText and SkeletonTextPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "SkeletonText",
      "SkeletonTextPropsProvider",
    ]);
  });

  it("exports no recipe binding or bare PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
