import { describe, expect, it } from "vitest";

import * as barrel from "#frame/index.ts";

describe("index", () => {
  it("exports Frame and FramePropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Frame", "FramePropsProvider"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
