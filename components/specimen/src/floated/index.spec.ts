import { describe, expect, it } from "vitest";

import * as barrel from "#floated/index.ts";

describe("index", () => {
  it("exports Floated and STAGED only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Floated", "STAGED"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
