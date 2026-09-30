import { describe, expect, expectTypeOf, it } from "vitest";

import * as types from "#network-graph/types.ts";

describe("types", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(types)).toStrictEqual([]);
  });

  it("types a network graph's props with the graph and its name", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.NetworkGraphProps>().toHaveProperty("links");
    expectTypeOf<types.NetworkGraphProps>().toHaveProperty("label").toEqualTypeOf<string>();
  });

  it("types a controlled focus with null for none", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.NetworkGraphProps["focus"]>().toEqualTypeOf<null | string | undefined>();
  });

  it("types a link's strength as a number", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.NetworkLink["strength"]>().toEqualTypeOf<number | undefined>();
  });

  it("omits the direction from a network graph's props", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.NetworkGraphProps>().not.toHaveProperty("direction");
  });
});
