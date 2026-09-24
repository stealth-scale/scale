import { describe, expect, it } from "vitest";

import * as barrel from "#folding/index.ts";

describe("index", () => {
  it("exports the folding styles and the priorities alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "FOLDED",
      "FOLDING",
      "PRIORITIES",
      "PRIORITY",
    ]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
