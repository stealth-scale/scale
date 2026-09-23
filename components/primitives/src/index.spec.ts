import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports Portal only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Portal"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
