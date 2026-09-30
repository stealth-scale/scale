import { describe, expect, it } from "vitest";

import * as barrel from "#code-block/index.ts";

describe("index", () => {
  it("limits its runtime exports to the parts plus the terminal output functions", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Code",
      "Content",
      "Control",
      "Copy",
      "Diff",
      "DiffStat",
      "Header",
      "Root",
      "Title",
      "parseAnsi",
      "stripAnsi",
    ]);
  });

  it("exports no name prefixed with recipe with use or PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
