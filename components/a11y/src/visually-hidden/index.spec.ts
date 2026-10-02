import { describe, expect, it } from "vitest";

import * as barrel from "#visually-hidden/index.ts";

describe("index", () => {
  it("exports VisuallyHidden and VisuallyHiddenPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "VisuallyHidden",
      "VisuallyHiddenPropsProvider",
    ]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
