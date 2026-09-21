import { describe, expect, it } from "vitest";

import * as barrel from "#roving-focus/index.ts";

describe("index", () => {
  it("limits its runtime exports to Item and Root", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Item", "Root"]);
  });

  it("exports no name prefixed with recipe with use or PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
