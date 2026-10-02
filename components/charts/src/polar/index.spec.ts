import { describe, expect, expectTypeOf, it } from "vitest";

import * as polar from "#polar/index.ts";

describe("index", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(polar)).toStrictEqual([]);
  });

  it("exports the types the pie and the donut share", () => {
    expect(Object.keys(polar)).toHaveLength(0);

    expectTypeOf<polar.PieSlice>().toHaveProperty("key");
    expectTypeOf<polar.PolarProps>().toHaveProperty("maxSlices");
  });
});
