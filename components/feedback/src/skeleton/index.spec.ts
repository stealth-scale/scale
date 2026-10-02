import { describe, expect, it } from "vitest";

import * as barrel from "#skeleton/index.ts";

describe("index", () => {
  it("exports Skeleton and SkeletonPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Skeleton", "SkeletonPropsProvider"]);
  });

  it("exports no recipe binding or bare PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
