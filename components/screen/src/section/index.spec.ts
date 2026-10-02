import { describe, expect, it } from "vitest";

import * as barrel from "#section/index.ts";

describe("index", () => {
  it("exports the eight parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Actions",
      "Body",
      "Description",
      "Footer",
      "Header",
      "Root",
      "Title",
    ]);
  });

  it("exports no recipe binding or room property", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|ROOM)/u);
    }
  });
});
