import { QueryClient } from "@tanstack/react-query";
import { describe, expect, expectTypeOf, it } from "vitest";

import { built } from "#cache.fixtures.ts";
import { ADA, LISTED, PEOPLE, PERSON, type Person } from "#operation.fixtures.ts";
import { isOperationKey, operationKey, operationQuery, resourcesOf } from "#queries.ts";

/**
 * Selects a person's name.
 *
 * @param data - The person.
 * @returns The name.
 */
function nameOf(data: Person): string {
  return data.name;
}

describe("queries", () => {
  it("keys an operation by its id with its variables", () => {
    expect(operationKey(PERSON, { id: "7" })).toStrictEqual([
      "operation",
      "people~1~9c1e7a",
      { id: "7" },
    ]);
  });

  it("builds options under the operation's key", () => {
    expect(operationQuery(PERSON, { id: "7" }).queryKey).toStrictEqual(
      operationKey(PERSON, { id: "7" }),
    );
  });

  it("puts the resource selectors in the query's meta", () => {
    const options = operationQuery(PEOPLE, {}, { resources: [LISTED] });

    expect(options.meta).toStrictEqual({ resources: [LISTED] });
  });

  it("states no resource selectors where none are given", () => {
    expect(operationQuery(PERSON, { id: "7" }).meta).toStrictEqual({ resources: [] });
  });

  it("passes the select through", () => {
    expect(operationQuery(PERSON, { id: "7" }, { select: nameOf }).select).toBe(nameOf);
  });

  it("passes the fresh time through", () => {
    expect(operationQuery(PERSON, { id: "7" }, { staleTime: "static" }).staleTime).toBe("static");
  });

  it("states only the key with the meta where no options are given", () => {
    expect(Object.keys(operationQuery(PERSON, { id: "7" })).toSorted()).toStrictEqual([
      "meta",
      "queryKey",
    ]);
  });

  it("tags the key with the operation's data", () => {
    const client = new QueryClient();
    const { queryKey } = operationQuery(PERSON, { id: "7" });

    client.setQueryData(queryKey, ADA);

    expectTypeOf(client.getQueryData(queryKey)).toEqualTypeOf<Person | undefined>();

    expect(client.getQueryData(queryKey)).toStrictEqual(ADA);
  });

  it("returns true for an operation's key", () => {
    expect(isOperationKey(operationKey(PERSON, { id: "7" }))).toBe(true);
  });

  it.each([
    { key: ["people", "people~1~9c1e7a", {}], label: "another first member" },
    { key: ["operation", 7, {}], label: "an id that is not a string" },
    { key: ["operation", "people~1~9c1e7a", []], label: "variables that are not an object" },
    { key: ["operation", "people~1~9c1e7a"], label: "no variables" },
  ])("returns false for a key with $label", ({ key }) => {
    expect(isOperationKey(key)).toBe(false);
  });

  it("reads the resource selectors of an operation's query", () => {
    const client = new QueryClient();
    const query = built(client, operationQuery(PEOPLE, {}, { resources: [LISTED] }));

    expect(resourcesOf(query)).toStrictEqual([LISTED]);
  });

  it("reads no resource selectors from a query built without operationQuery", () => {
    const client = new QueryClient();

    expect(resourcesOf(built(client, { queryKey: operationKey(PEOPLE, {}) }))).toStrictEqual([]);
  });
});
