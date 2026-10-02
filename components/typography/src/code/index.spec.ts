import { describe, expect, it } from "vitest";

import * as barrel from "#code/index.ts";

describe("index", () => {
  it("exports Code only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Code"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
