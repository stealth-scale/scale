import { describe, expect, it } from "vitest";

import * as RadioGroup from "#radio-group/index.ts";

describe("index", () => {
  it("exports the five parts by their short names", () => {
    expect(Object.keys(RadioGroup).toSorted()).toStrictEqual([
      "Item",
      "ItemControl",
      "ItemText",
      "Label",
      "Root",
    ]);
  });
});
