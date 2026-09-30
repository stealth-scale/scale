import { describe, expect, it } from "vitest";

import { factsOf } from "#box-plot/words.ts";
import { numberFormatter } from "#chart/format.ts";
import { boxStats } from "#stats/box.ts";

/**
 * Names the tooltip's rows.
 */
const WORDS = {
  count: "Count",
  median: "Median",
  outliers: "Outliers",
  quartiles: "Middle half",
  whiskers: "Whiskers",
};

/**
 * Writes values in milliseconds and counts as plain numbers.
 */
const FORMATS = {
  count: numberFormatter("en-US"),
  value: numberFormatter("en-US", { style: "unit", unit: "millisecond", unitDisplay: "narrow" }),
};

/**
 * Returns the tooltip's rows for eleven response times with one slow outlier.
 */
function rowsOf(): ReturnType<ReturnType<typeof factsOf>> {
  const summary = boxStats([12, 18, 21, 25, 30, 33, 35, 38, 41, 44, 180]);

  return factsOf(WORDS, FORMATS)([{ payload: { key: "api", label: "API", summary } }]);
}

describe("words", () => {
  it("names the rows in reading order", () => {
    expect(rowsOf().map((row) => row.name)).toStrictEqual([
      "Median",
      "Middle half",
      "Whiskers",
      "Outliers",
      "Count",
    ]);
  });

  it.each([
    { key: "median", value: "33ms" },
    { key: "quartiles", value: "23–39.5ms" },
    { key: "whiskers", value: "12–44ms" },
    { key: "outliers", value: "1" },
    { key: "count", value: "11" },
  ])("writes $key as $value", ({ key, value }) => {
    expect(rowsOf().find((row) => row.key === key)?.value).toBe(value);
  });

  it("returns no rows without an entry", () => {
    expect(factsOf(WORDS, FORMATS)([])).toStrictEqual([]);
  });
});
