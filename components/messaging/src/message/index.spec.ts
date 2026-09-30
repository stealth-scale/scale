import { describe, expect, it } from "vitest";

import * as barrel from "#message/index.ts";

describe("index", () => {
  it("exports the eight parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Actions",
      "Avatar",
      "Bubble",
      "Content",
      "Footer",
      "Header",
      "Root",
      "Status",
    ]);
  });
});
