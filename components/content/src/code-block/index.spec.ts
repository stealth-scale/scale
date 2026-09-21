import { describe, expect, it } from "vitest";

import * as barrel from "#code-block/index.ts";

describe("index", () => {
  it("limits its runtime exports to the seven parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Code",
      "Content",
      "Control",
      "Copy",
      "Header",
      "Root",
      "Title",
    ]);
  });

  it("exports no name prefixed with recipe with use or PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
