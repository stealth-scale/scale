import { describe, expect, it } from "vitest";

import * as ToggleGroup from "#toggle-group/index.ts";

describe("index", () => {
  it("exports the two parts by their short names", () => {
    expect(Object.keys(ToggleGroup).toSorted()).toStrictEqual(["Item", "Root"]);
  });
});
