import { describe, expect, it } from "vitest";

import * as barrel from "#status-matrix/index.ts";

describe("index", () => {
  it("exports StatusMatrix alone at runtime", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["StatusMatrix"]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
