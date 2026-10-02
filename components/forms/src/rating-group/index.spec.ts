import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#rating-group/index.ts";

describe("index", () => {
  it("exports the six parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Control",
      "Item",
      "ItemIndicator",
      "Items",
      "Label",
      "Root",
    ]);
  });

  it("throws for every part that reads the machine rendered outside a root", () => {
    const { Item, Items, Label } = barrel;

    expect(
      rootedViolations(
        { Item, Items, Label },
        "A part of RatingGroup was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });

  it("throws for the bound parts rendered outside a root", () => {
    const { Control, ItemIndicator } = barrel;

    expect(rootedViolations({ Control, ItemIndicator }, /missing its Provider/u)).toStrictEqual([]);
  });
});
