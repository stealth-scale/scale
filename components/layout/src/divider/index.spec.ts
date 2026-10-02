import { describe, expect, it } from "vitest";

import * as barrel from "#divider/index.ts";

describe("index", () => {
  it("exports Divider and DividerPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Divider", "DividerPropsProvider"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
