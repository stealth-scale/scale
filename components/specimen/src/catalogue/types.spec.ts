import { describe, expect, expectTypeOf, it } from "vitest";

import * as types from "#catalogue/types.ts";

describe("types", () => {
  it("exports nothing at run time and re-exports the index's and the engine's types", () => {
    expect(Object.keys(types)).toStrictEqual([]);

    expectTypeOf<types.Indexed>().toHaveProperty("load");
    expectTypeOf<types.Fragments>().toHaveProperty("imported");
    expectTypeOf<types.Anatomy>().toHaveProperty("parts");
    expectTypeOf<types.RunOptions>().toHaveProperty("rules");
    expectTypeOf<types.AxeResults>().toHaveProperty("violations");
  });
});
