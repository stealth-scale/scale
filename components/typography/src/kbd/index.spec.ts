import { describe, expect, it } from "vitest";

import * as barrel from "#kbd/index.ts";

describe("index", () => {
  it("exports Group and Root only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Group", "Root"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
