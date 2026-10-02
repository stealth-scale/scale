import { describe, expect, it } from "vitest";

import * as examples from "#slider/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "balance",
      "equalizer",
      "opacity",
      "price",
      "seats",
      "storage",
      "volume",
    ]);
  });
});
