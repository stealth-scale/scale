import { describe, expect, expectTypeOf, it } from "vitest";

import * as types from "#scatter-plot/types.ts";

describe("types", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(types)).toStrictEqual([]);
  });

  it("types the label field as a field of the points", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.ScatterPlotProps<{ name: string; x: number }>["labelKey"]>().toEqualTypeOf<
      "name" | "x" | undefined
    >();
  });

  it("types the ends of an axis as two words", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.ScatterPlotProps<object>["xEnds"]>().toEqualTypeOf<
      readonly [string, string] | undefined
    >();
  });
});
