import { describe, expect, it } from "vitest";

import collections from "@stealthscale/component-collections/theme";

import { CELL_INSET, ROW_FILL, RULE_INK, RULE_WIDTH } from "#data-table/properties.ts";

describe("properties", () => {
  it("names the row fill and the rule properties the collections table's rows state", () => {
    const row = collections.theme?.extend?.slotRecipes?.["table"]?.base?.["row"] ?? {};

    expect([ROW_FILL in row, RULE_INK in row, RULE_WIDTH in row]).toStrictEqual([true, true, true]);
  });

  it("names the inline inset the collections table's cells state", () => {
    const size = collections.theme?.extend?.slotRecipes?.["table"]?.variants?.["size"];

    expect(Object.keys(size?.["md"]?.["cell"] ?? {})).toContain(CELL_INSET);
  });
});
