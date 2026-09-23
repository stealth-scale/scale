import { describe, expect, it } from "vitest";

import * as barrel from "#stack/index.ts";

describe("index", () => {
  it("exports Stack and StackPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Stack", "StackPropsProvider"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
