import { describe, expect, it } from "vitest";

import * as barrel from "#quote/index.ts";

describe("index", () => {
  it("exports Quote only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Quote"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
