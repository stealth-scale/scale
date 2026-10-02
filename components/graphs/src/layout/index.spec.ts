import { describe, expect, expectTypeOf, it } from "vitest";

import * as layout from "#layout/index.ts";

describe("index", () => {
  it("exports layoutForce and layoutGraph at run time", () => {
    expect(Object.keys(layout).toSorted()).toStrictEqual(["layoutForce", "layoutGraph"]);
  });

  it("exports the direction of a layout by rank", () => {
    expect(Object.keys(layout)).toHaveLength(2);

    expectTypeOf<layout.GraphDirection>().toEqualTypeOf<"down" | "right">();
  });

  it("exports the options of a layout by force", () => {
    expect(Object.keys(layout)).toContain("layoutForce");

    expectTypeOf<layout.ForceOptions>().toEqualTypeOf<{
      readonly iterations?: number | undefined;
      readonly seed?: number | undefined;
    }>();
  });
});
