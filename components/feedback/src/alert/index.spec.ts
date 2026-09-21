import { describe, expect, it } from "vitest";

import * as barrel from "#alert/index.ts";

describe("index", () => {
  it("exports only the six slot components and LIVES", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Aside",
      "Content",
      "Description",
      "Indicator",
      "LIVES",
      "Root",
      "Title",
    ]);
  });

  it("omits every export named as a recipe or a context binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
