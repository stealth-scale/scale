import { describe, expect, it } from "vitest";

import * as barrel from "#skip-nav/index.ts";

describe("index", () => {
  it("exports Link SKIP_NAV_TARGET and Target only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Link", "SKIP_NAV_TARGET", "Target"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
