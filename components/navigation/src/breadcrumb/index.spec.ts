import { describe, expect, it } from "vitest";

import * as barrel from "#breadcrumb/index.ts";

describe("index", () => {
  it("exports the seven parts only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "CurrentLink",
      "Ellipsis",
      "Item",
      "Link",
      "List",
      "Root",
      "Separator",
    ]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
