import { describe, expect, expectTypeOf, it } from "vitest";

import * as types from "#polar/types.ts";

describe("types", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(types)).toStrictEqual([]);
  });

  it("types a slice with its key and value", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.PieSlice>().toHaveProperty("value").toEqualTypeOf<number>();
  });

  it("types the pie's props with the slices", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.PolarProps>().toHaveProperty("slices");
  });
});
