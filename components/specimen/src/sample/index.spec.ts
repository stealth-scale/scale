import { describe, expect, it } from "vitest";

import * as barrel from "#sample/index.ts";

describe("index", () => {
  it("limits its runtime exports to three names", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["DisplayProvider", "Sample", "grounded"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
