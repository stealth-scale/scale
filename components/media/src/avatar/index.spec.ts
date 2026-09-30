import { describe, expect, it } from "vitest";

import * as barrel from "#avatar/index.ts";

describe("index", () => {
  it("exports the five parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Badge",
      "Fallback",
      "Group",
      "Image",
      "Root",
    ]);
  });
});
