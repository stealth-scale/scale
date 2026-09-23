import { describe, expect, it } from "vitest";

import * as barrel from "#link/index.ts";

describe("index", () => {
  it("exports Link and LinkPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Link", "LinkPropsProvider"]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
