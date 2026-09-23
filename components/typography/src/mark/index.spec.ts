import { describe, expect, it } from "vitest";

import * as barrel from "#mark/index.ts";

describe("index", () => {
  it("exports Mark and MarkPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Mark", "MarkPropsProvider"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
