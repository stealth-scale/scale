import { describe, expect, it } from "vitest";

import * as sparkbar from "#sparkbar/index.ts";

describe("index", () => {
  it("exports Sparkbar alone", () => {
    expect(Object.keys(sparkbar)).toStrictEqual(["Sparkbar"]);
  });
});
