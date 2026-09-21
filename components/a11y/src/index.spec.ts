import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("limits its runtime exports to the three components and one props provider", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "RovingFocus",
      "SkipNav",
      "VisuallyHidden",
      "VisuallyHiddenPropsProvider",
    ]);
  });

  it("exposes SkipNav as a namespace holding Link SKIP_NAV_TARGET and Target", () => {
    expect(Object.keys(barrel.SkipNav).toSorted()).toStrictEqual([
      "Link",
      "SKIP_NAV_TARGET",
      "Target",
    ]);
  });

  it("exposes RovingFocus as a namespace holding Item and Root", () => {
    expect(Object.keys(barrel.RovingFocus).toSorted()).toStrictEqual(["Item", "Root"]);
  });

  it("exports no name prefixed with recipe with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
