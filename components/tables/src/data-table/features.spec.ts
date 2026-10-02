import { stockFeatures } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";

import { FEATURES } from "#data-table/features.ts";
import { AGGREGATION_FNS, FILTER_FNS, SORT_FNS } from "#data-table/registries.ts";

describe("FEATURES", () => {
  it.each(Object.keys(stockFeatures))("registers the stock feature %s", (name) => {
    expect(FEATURES).toHaveProperty(name);
  });

  it.each([
    "expandedRowModel",
    "facetedMinMaxValues",
    "facetedRowModel",
    "facetedUniqueValues",
    "filteredRowModel",
    "groupedRowModel",
    "paginatedRowModel",
    "sortedRowModel",
  ])("registers the row model %s", (slot) => {
    expect(FEATURES).toHaveProperty(slot);
  });

  it("registers the stock sort functions", () => {
    expect(FEATURES.sortFns).toBe(SORT_FNS);
  });

  it("registers the stock filter functions", () => {
    expect(FEATURES.filterFns).toBe(FILTER_FNS);
  });

  it("registers the stock aggregation functions", () => {
    expect(FEATURES.aggregationFns).toBe(AGGREGATION_FNS);
  });
});
