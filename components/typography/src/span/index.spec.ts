import { describe, expect, it } from "vitest";

import * as barrel from "#span/index.ts";

describe("index", () => {
  it("exports Span only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Span"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
