import { describe, expect, it } from "vitest";

import * as published from "#index.ts";
import * as tanstack from "#tanstack.ts";

/**
 * The library's names a component reads data with, which the package publishes.
 */
const LIBRARY = [
  "infiniteQueryOptions",
  "keepPreviousData",
  "onlineManager",
  "queryOptions",
  "skipToken",
  "useInfiniteQuery",
  "useIsFetching",
  "useIsMutating",
  "useMutation",
  "useMutationState",
  "useQueries",
  "useQuery",
  "useQueryClient",
  "useSuspenseInfiniteQuery",
  "useSuspenseQueries",
  "useSuspenseQuery",
] as const;

/**
 * The names this package publishes of its own.
 */
const OWN = [
  "DataError",
  "DataProvider",
  "createDataClient",
  "defineMutation",
  "defineQuery",
  "defineSubscription",
  "fieldErrorsOf",
  "gatewayTransport",
  "invalidateChanges",
  "operationKey",
  "operationQuery",
  "resetData",
  "useNetwork",
  "useOperationMutation",
] as const;

describe("tanstack", () => {
  it.each(LIBRARY)("re-exports %s", (name) => {
    expect(tanstack).toHaveProperty(name);
  });

  it("re-exports the written list alone", () => {
    expect(Object.keys(tanstack).toSorted()).toStrictEqual([...LIBRARY].toSorted());
  });

  it.each([...LIBRARY, ...OWN])("publishes %s", (name) => {
    expect(published).toHaveProperty(name);
  });

  it("publishes the library's names with the package's own and nothing else", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual([...LIBRARY, ...OWN].toSorted());
  });
});
