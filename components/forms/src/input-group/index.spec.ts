import { describe, expect, it } from "vitest";

import * as barrel from "#input-group/index.ts";

describe("index", () => {
  it("exports the five parts only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Addon", "Field", "Mark", "Root", "Row"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
