import { describe, expect, it } from "vitest";

import * as barrel from "#card/index.ts";

describe("index", () => {
  it("exports every part and nothing else", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Aside",
      "Content",
      "Description",
      "Footer",
      "Header",
      "Indicator",
      "Media",
      "Overlay",
      "Root",
      "Section",
      "Title",
    ]);
  });

  it("exports neither the recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
