import { describe, expect, it } from "vitest";

import * as examples from "#angle-slider/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "gradient",
      "rotation",
      "tilt",
      "wind",
    ]);
  });
});
