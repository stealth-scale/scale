import { describe, expect, it } from "vitest";

import * as cohort from "#cohort/index.ts";

describe("index", () => {
  it("exports the cohort helpers as its runtime names", () => {
    expect(Object.keys(cohort).toSorted()).toStrictEqual([
      "cohortAverages",
      "cohortCells",
      "cohortSeriesKey",
      "retentionRate",
      "retentionSeries",
    ]);
  });
});
