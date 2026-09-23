import { describe, expect, it } from "vitest";

import * as barrel from "#input/index.ts";

describe("index", () => {
  it("exports Input and InputPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Input", "InputPropsProvider"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
