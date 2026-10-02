import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports every component of the package and nothing else", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Card"]);
  });

  it("exports the card's parts under the Card namespace", () => {
    expect(Object.keys(barrel.Card).toSorted()).toStrictEqual([
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

  it("exports neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
