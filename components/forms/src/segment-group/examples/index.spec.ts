import { describe, expect, it } from "vitest";

import * as examples from "#segment-group/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "alignment",
      "listing",
      "period",
      "range",
      "views",
    ]);
  });
});
