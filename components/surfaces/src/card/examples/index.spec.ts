import { describe, expect, it } from "vitest";

import * as examples from "#card/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "article",
      "balance",
      "expandable",
      "invoice",
      "linked",
      "loading",
      "plan",
      "product",
      "profile",
      "settings",
    ]);
  });
});
