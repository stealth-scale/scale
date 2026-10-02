import { describe, expect, it } from "vitest";

import * as barrel from "#transfer/index.ts";

describe("index", () => {
  it("exports Transfer alone at runtime", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Transfer"]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
