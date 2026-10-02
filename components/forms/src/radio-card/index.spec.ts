import { describe, expect, it } from "vitest";

import * as RadioCard from "#radio-card/index.ts";

describe("index", () => {
  it("exports the eight parts by their short names", () => {
    expect(Object.keys(RadioCard).toSorted()).toStrictEqual([
      "Item",
      "ItemAddon",
      "ItemContent",
      "ItemDescription",
      "ItemIndicator",
      "ItemText",
      "Label",
      "Root",
    ]);
  });
});
