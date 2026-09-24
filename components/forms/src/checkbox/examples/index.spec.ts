import { describe, expect, it } from "vitest";

import * as examples from "#checkbox/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "consent",
      "notifications",
      "setting",
      "summary",
      "terms",
    ]);
  });
});
