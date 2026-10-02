import { describe, expect, expectTypeOf, it } from "vitest";

import { type ResourceReference } from "#access.ts";
import {
  defineMutation,
  defineQuery,
  defineSubscription,
  mutation,
  type MutationData,
  type MutationReference,
  type MutationVariables,
  query,
  type QueryData,
  type QueryReference,
  type QueryVariables,
} from "#data.ts";

interface Person {
  readonly id: string;
  readonly name: string;
}

const PERSON_KIND: ResourceReference = { id: "people/person", kind: "resource" };

const PERSON = defineQuery<Person, { readonly id: string }>("people~1~9c1e7a");

const RENAME = defineMutation<Person, Person>("people~1~41b0d2");

const ADA: Person = { id: "7", name: "Ada" };

describe("data", () => {
  it("defines a query by the id the gateway runs it under", () => {
    expect(PERSON).toStrictEqual({ id: "people~1~9c1e7a", kind: "query" });
  });

  it("defines a mutation by the id the gateway runs it under", () => {
    expect(RENAME).toStrictEqual({ id: "people~1~41b0d2", kind: "mutation" });
  });

  it("defines a subscription by the id the gateway runs it under", () => {
    expect(defineSubscription<{ readonly changes: [] }>("people~1~c0ffee")).toStrictEqual({
      id: "people~1~c0ffee",
      kind: "subscription",
    });
  });

  it("marks a query", () => {
    const records = [{ id: "id", type: PERSON_KIND }];

    expect(
      query({ operation: PERSON, records, sample: { data: ADA, variables: { id: "7" } } }),
    ).toStrictEqual({
      kind: "query",
      operation: PERSON,
      records,
      sample: { data: ADA, variables: { id: "7" } },
    });
  });

  it("marks a mutation", () => {
    const changes = [{ action: "updated", id: "id", type: PERSON_KIND }] as const;

    expect(
      mutation({ changes, operation: RENAME, sample: { data: ADA, variables: ADA } }),
    ).toStrictEqual({
      changes,
      kind: "mutation",
      operation: RENAME,
      sample: { data: ADA, variables: ADA },
    });
  });

  it("types a query reference's data and variables", () => {
    const reference: QueryReference<"people/person", Person, { readonly id: string }> = {
      id: "people/person",
      kind: "query",
    };

    expect(reference.kind).toBe("query");

    expectTypeOf<QueryData<typeof reference>>().toEqualTypeOf<Person>();
    expectTypeOf<QueryVariables<typeof reference>>().toEqualTypeOf<{ readonly id: string }>();
  });

  it("types a mutation reference's data and variables", () => {
    const reference: MutationReference<"people/rename", Person, Person> = {
      id: "people/rename",
      kind: "mutation",
    };

    expect(reference.kind).toBe("mutation");

    expectTypeOf<MutationData<typeof reference>>().toEqualTypeOf<Person>();
    expectTypeOf<MutationVariables<typeof reference>>().toEqualTypeOf<Person>();
  });
});
