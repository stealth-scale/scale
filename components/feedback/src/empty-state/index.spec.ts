import { describe, expect, it } from "vitest";

import * as barrel from "#empty-state/index.ts";

describe("index", () => {
  it("exports the five parts only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Description",
      "Indicator",
      "Root",
      "Title",
    ]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
