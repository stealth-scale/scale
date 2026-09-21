import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports only the two public names", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Badge", "BadgePropsProvider"]);
  });

  it("exports no recipe or binding helper", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
