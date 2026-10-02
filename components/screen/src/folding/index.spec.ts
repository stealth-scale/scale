import { describe, expect, it } from "vitest";

import * as barrel from "#folding/index.ts";

describe("index", () => {
  it("exports the names the rows fold with", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "FOLDING",
      "FoldContext",
      "More",
      "NARROW",
      "PRIORITIES",
      "PRIORITY",
      "Trigger",
      "priorityOf",
      "useFoldable",
      "useFolded",
    ]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with)/u);
    }
  });
});
