import * as TanStack from "@tanstack/react-table";
import { describe, expect, it } from "vitest";

import { AGGREGATION_FNS, FILTER_FNS, SORT_FNS } from "#data-table/registries.ts";

/**
 * Returns the names of every function TanStack exports under a prefix, without the prefix.
 */
function exported(prefix: string): string[] {
  return Object.keys(TanStack)
    .filter((name) => name.startsWith(prefix))
    .map((name) => name.slice(prefix.length))
    .toSorted();
}

describe("registries", () => {
  it("registers every sort function TanStack exports", () => {
    expect(Object.keys(SORT_FNS).toSorted()).toStrictEqual(exported("sortFn_"));
  });

  it("registers every filter function TanStack exports", () => {
    expect(Object.keys(FILTER_FNS).toSorted()).toStrictEqual(exported("filterFn_"));
  });

  it("registers every aggregation function TanStack exports", () => {
    expect(Object.keys(AGGREGATION_FNS).toSorted()).toStrictEqual(exported("aggregationFn_"));
  });

  it("registers twenty-two filter functions", () => {
    expect(Object.keys(FILTER_FNS)).toHaveLength(22);
  });

  it("registers each function under its stock name", () => {
    expect(FILTER_FNS.greaterThan).toBe(TanStack.filterFn_greaterThan);
  });
});
