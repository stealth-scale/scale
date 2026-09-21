import { describe, expect, it } from "vitest";

import * as barrel from "#button/index.ts";

describe("index", () => {
  it("exports only the three public names", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Button",
      "ButtonPropsProvider",
      "IconButton",
    ]);
  });

  it("exports no recipe or binding helper", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
