import { describe, expect, it } from "vitest";

import * as barrel from "#focused/index.ts";

describe("index", () => {
  it("exports Focused only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Focused"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
