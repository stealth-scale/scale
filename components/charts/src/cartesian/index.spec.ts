import { describe, expect, expectTypeOf, it } from "vitest";

import * as cartesian from "#cartesian/index.ts";

describe("index", () => {
  it("exports the merge of two periods alone at run time", () => {
    expect(Object.keys(cartesian)).toStrictEqual(["alignPeriods"]);
  });

  it("exports the types the presets share", () => {
    expect(Object.keys(cartesian)).toHaveLength(1);

    expectTypeOf<cartesian.Curve>().toEqualTypeOf<"linear" | "monotone">();
    expectTypeOf<cartesian.CartesianSeries>().toHaveProperty("previousOf");
    expectTypeOf<cartesian.CartesianProps<{ day: string }>>().toHaveProperty("annotations");
  });

  it("exports the types of mixed marks", () => {
    expect(Object.keys(cartesian)).toHaveLength(1);

    expectTypeOf<cartesian.Mark>().toEqualTypeOf<"area" | "bar" | "line">();
    expectTypeOf<cartesian.ValueAxis>().toEqualTypeOf<"end" | "start">();
    expectTypeOf<cartesian.ComboSeries>().toHaveProperty("mark");
    expectTypeOf<cartesian.RangeBand>().toHaveProperty("high");
  });

  it("exports the types of annotations and of a merge of periods", () => {
    expect(Object.keys(cartesian)).toHaveLength(1);

    expectTypeOf<cartesian.Annotation>().toHaveProperty("until");
    expectTypeOf<cartesian.AlignOptions<{ day: string }>>().toHaveProperty("keys");
  });
});
