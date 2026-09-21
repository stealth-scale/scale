import { describe, expect, it } from "vitest";

import * as barrel from "#skip-nav/index.ts";

describe("index", () => {
  it("limits its runtime exports to Link SKIP_NAV_TARGET and Target", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Link", "SKIP_NAV_TARGET", "Target"]);
  });

  it("exports no name prefixed with recipe with use or PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
