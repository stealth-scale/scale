import { describe, expect, it } from "vitest";

import * as examples from "#radio-card/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "billing",
      "delivery",
      "plans",
      "speeds",
    ]);
  });
});
