import { describe, expect, expectTypeOf, it } from "vitest";

import {
  defineMutation,
  defineQuery,
  defineSubscription,
  type NoVariables,
  type Operation,
} from "#operation.ts";

describe("operation", () => {
  it("defines a query under the id the gateway runs it by", () => {
    expect(defineQuery<{ readonly count: number }>("people~1~9c1e7a")).toStrictEqual({
      id: "people~1~9c1e7a",
      kind: "query",
    });
  });

  it("defines a mutation under the id the gateway runs it by", () => {
    expect(defineMutation<null, { readonly id: string }>("people~1~41b0d2")).toStrictEqual({
      id: "people~1~41b0d2",
      kind: "mutation",
    });
  });

  it("defines a subscription under the id the gateway runs it by", () => {
    expect(defineSubscription<{ readonly id: string }>("people~1~77aa01")).toStrictEqual({
      id: "people~1~77aa01",
      kind: "subscription",
    });
  });

  it("types a query's data and variables", () => {
    const byId = defineQuery<{ readonly name: string }, { readonly id: string }>("people~1~9c1e7a");

    expectTypeOf(byId).toEqualTypeOf<
      Operation<{ readonly name: string }, { readonly id: string }, "query">
    >();

    expect(byId.kind).toBe("query");
  });

  it("types the variables of a query that states none as empty", () => {
    const all = defineQuery<readonly string[]>("people~1~0b5e11");

    expectTypeOf(all).toEqualTypeOf<Operation<readonly string[], NoVariables, "query">>();

    expect(all.kind).toBe("query");
  });
});
