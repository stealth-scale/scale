import { describe, expect, it } from "vitest";

import * as barrel from "#visually-hidden/index.ts";

describe("index", () => {
  it("limits its exports to VisuallyHidden and VisuallyHiddenPropsProvider", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "VisuallyHidden",
      "VisuallyHiddenPropsProvider",
    ]);
  });

  it("exports no name prefixed with recipe with use or PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
