import { describe, expect, it } from "vitest";

import * as examples from "#accordion/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "checkout",
      "clauses",
      "documents",
      "faq",
      "filters",
      "reviewers",
    ]);
  });
});
