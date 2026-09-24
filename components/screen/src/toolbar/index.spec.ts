import { describe, expect, it } from "vitest";

import * as barrel from "#toolbar/index.ts";

describe("index", () => {
  it("exports the nine parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Center",
      "End",
      "Folded",
      "Item",
      "Root",
      "Search",
      "Separator",
      "Start",
    ]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|GAP)/u);
    }
  });
});
