import { describe, expect, it } from "vitest";

import * as comboChart from "#combo-chart/index.ts";

describe("index", () => {
  it("exports ComboChart alone", () => {
    expect(Object.keys(comboChart)).toStrictEqual(["ComboChart"]);
  });
});
