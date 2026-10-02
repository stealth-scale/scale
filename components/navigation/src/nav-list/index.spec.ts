import { describe, expect, it } from "vitest";

import * as barrel from "#nav-list/index.ts";

describe("index", () => {
  it("exports the ten parts and the props provider alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Badge",
      "Branch",
      "Content",
      "Indicator",
      "Item",
      "Link",
      "PropsProvider",
      "Root",
      "Skeleton",
      "Trigger",
    ]);
  });

  it("exports no name that starts with recipe or with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
