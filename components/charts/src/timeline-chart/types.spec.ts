import { describe, expect, expectTypeOf, it } from "vitest";

import { type TimelineEvent } from "#events/layout.ts";
import * as types from "#timeline-chart/types.ts";

describe("types", () => {
  it("exports nothing at run time", () => {
    expect(Object.keys(types)).toStrictEqual([]);
  });

  it("takes no ratio prop", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.TimelineChartProps>().not.toHaveProperty("ratio");
  });

  it("types a selection as the moments of a marker", () => {
    expect(Object.keys(types)).toHaveLength(0);

    expectTypeOf<types.TimelineChartProps["onSelect"]>().toEqualTypeOf<
      ((events: readonly TimelineEvent[]) => void) | undefined
    >();
  });
});
