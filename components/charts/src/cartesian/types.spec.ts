import { describe, expect, expectTypeOf, it } from "vitest";

import { type Annotation } from "#cartesian/annotations.ts";
import * as types from "#cartesian/types.ts";

describe("types", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(types)).toStrictEqual([]);
  });

  it("types the category key as a field of the rows", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<
      types.CartesianProps<{ day: string; paid: number }>["categoryKey"]
    >().toEqualTypeOf<"day" | "paid">();
  });

  it("types a series with its dashed switch", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.CartesianSeries>().toHaveProperty("dashed");
  });

  it("types a combo series with a required mark", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.ComboSeries["mark"]>().toEqualTypeOf<"area" | "bar" | "line">();
  });

  it("types a series' value axis as the start or the end", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.CoreSeries["axis"]>().toEqualTypeOf<"end" | "start" | undefined>();
  });

  it("types a band by its two fields", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<Pick<types.RangeBand, "high" | "low">>().toEqualTypeOf<{
      readonly high: string;
      readonly low: string;
    }>();
  });

  it("types the stacks about a moving baseline", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<"silhouette" | "wiggle">().toExtend<types.Shape["stack"]>();
  });

  it("types an earlier period by the key of the series it precedes", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.CartesianSeries["previousOf"]>().toEqualTypeOf<string | undefined>();
  });

  it("types the annotations as a list the props may leave out", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.CartesianProps<{ day: string }>["annotations"]>().toEqualTypeOf<
      readonly Annotation[] | undefined
    >();
  });
});
