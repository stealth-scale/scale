import { describe, expect, it } from "vitest";

import * as stepLineChart from "#step-line-chart/index.ts";

describe("index", () => {
  it("exports StepLineChart alone", () => {
    expect(Object.keys(stepLineChart)).toStrictEqual(["StepLineChart"]);
  });
});
