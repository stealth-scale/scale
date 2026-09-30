import { describe, expect, expectTypeOf, it } from "vitest";

import * as types from "#hierarchy/types.ts";

describe("types", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(types)).toStrictEqual([]);
  });

  it("types a hierarchy chart's props with the nodes and the label", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.HierarchyProps>().toHaveProperty("nodes");
    expectTypeOf<types.HierarchyProps>().toHaveProperty("label").toEqualTypeOf<string>();
  });
});
