import { describe, expect, it } from "vitest";

import * as barrel from "#skeleton-text/index.ts";

describe("index", () => {
  it("exports only the component and its props provider", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "SkeletonText",
      "SkeletonTextPropsProvider",
    ]);
  });

  it("renames the props provider so that no bare PropsProvider escapes", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
