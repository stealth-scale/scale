import { describe, expect, it } from "vitest";

import * as barrel from "#video/index.ts";

describe("index", () => {
  it("exports Video and VideoPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Video", "VideoPropsProvider"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
