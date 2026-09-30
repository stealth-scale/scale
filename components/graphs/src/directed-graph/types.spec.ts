import { describe, expect, expectTypeOf, it } from "vitest";

import * as types from "#directed-graph/types.ts";

describe("types", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(types)).toStrictEqual([]);
  });

  it("types a directed graph's props with the graph and its name", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.DirectedGraphProps>().toHaveProperty("nodes");
    expectTypeOf<types.DirectedGraphProps>().toHaveProperty("label").toEqualTypeOf<string>();
  });

  it("types a controlled focus with null for none", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.DirectedGraphProps["focus"]>().toEqualTypeOf<null | string | undefined>();
  });

  it("types the trace as one of three effects", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.TraceMode>().toEqualTypeOf<"highlight" | "isolate" | "off">();
  });
});
