import { describe, expect, it } from "vitest";

import * as barrel from "#container/index.ts";

describe("index", () => {
  it("exports Container and ContainerPropsProvider only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Container", "ContainerPropsProvider"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
