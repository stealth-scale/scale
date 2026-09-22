import { describe, expect, it } from "vitest";

import * as barrel from "#sidebar/index.ts";

describe("index", () => {
  it("names every part a caller composes", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Empty",
      "Footer",
      "Header",
      "Nav",
      "NavAction",
      "NavHeading",
      "NavLabel",
      "Root",
      "Search",
      "Separator",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
