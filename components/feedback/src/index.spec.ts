import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the public runtime names and no others", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Alert",
      "EmptyState",
      "Loader",
      "LoaderOverlay",
      "Skeleton",
      "SkeletonPropsProvider",
      "SkeletonText",
      "SkeletonTextPropsProvider",
      "Spinner",
    ]);
  });

  it("exports Alert as a namespace of its parts", () => {
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

  it("exports no name that starts with recipe or with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
