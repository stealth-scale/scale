import { describe, expect, expectTypeOf, it } from "vitest";

import * as types from "#anatomy/types.ts";

describe("types", () => {
  it("exports nothing at run time and re-exports the compiler's types", () => {
    expect(Object.keys(types)).toStrictEqual([]);

    expectTypeOf<types.Project>().toHaveProperty("checker");
    expectTypeOf<types.Symbol>().toHaveProperty("declarations");
    expectTypeOf<types.Type>().toHaveProperty("isUnionType");
  });
});
