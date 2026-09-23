import { describe, expect, it } from "vitest";

import * as barrel from "#search-input/index.ts";

describe("index", () => {
  it("exports SearchInput only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["SearchInput"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
