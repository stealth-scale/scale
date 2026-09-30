import { describe, expect, it } from "vitest";

import * as examples from "#rating-group/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "average",
      "review",
      "stay",
      "support",
      "useful",
    ]);
  });
});
