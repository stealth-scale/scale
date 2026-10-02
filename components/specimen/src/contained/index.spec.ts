import { describe, expect, it } from "vitest";

import * as barrel from "#contained/index.ts";

describe("index", () => {
  it("exports Contained only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Contained"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
