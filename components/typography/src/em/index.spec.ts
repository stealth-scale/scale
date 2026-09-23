import { describe, expect, it } from "vitest";

import * as barrel from "#em/index.ts";

describe("index", () => {
  it("exports Em only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Em"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
