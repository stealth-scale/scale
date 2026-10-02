import { describe, expect, it } from "vitest";

import * as barrel from "#reactions/index.ts";

describe("index", () => {
  it("exports the four parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Choice", "Item", "Picker", "Root"]);
  });
});
