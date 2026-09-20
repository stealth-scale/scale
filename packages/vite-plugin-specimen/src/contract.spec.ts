import { describe, expect, expectTypeOf, it } from "vitest";

import * as contract from "#contract.ts";

describe("contract", () => {
  it("exports nothing at run time and declares what the emitted modules carry", () => {
    expect(Object.keys(contract)).toStrictEqual([]);

    expectTypeOf<contract.Indexed>().toHaveProperty("load");
    expectTypeOf<contract.Indexed["props"]>().toEqualTypeOf<
      (() => Promise<contract.Anatomy>) | undefined
    >();
    expectTypeOf<contract.Fragments>().toHaveProperty("imported");
    expectTypeOf<contract.Read>().toEqualTypeOf<contract.Entry | contract.Refused>();
    expectTypeOf<contract.Kind>().toEqualTypeOf<"option" | "variant">();
  });
});
