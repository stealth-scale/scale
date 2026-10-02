import { describe, expect, it } from "vitest";

import * as barrel from "#roving-focus/index.ts";

describe("index", () => {
  it("exports Item and Root only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Item", "Root"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
