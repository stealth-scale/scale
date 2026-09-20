import { describe, expect, it } from "vitest";

import * as barrel from "#stage/index.ts";

describe("index", () => {
  it("names every export and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "PHONE",
      "Stage",
      "stageWidthOf",
      "widthsOf",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
