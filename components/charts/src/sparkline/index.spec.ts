import { describe, expect, it } from "vitest";

import * as sparkline from "#sparkline/index.ts";

describe("index", () => {
  it("exports Sparkline alone", () => {
    expect(Object.keys(sparkline)).toStrictEqual(["Sparkline"]);
  });
});
