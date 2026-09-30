import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#tags-input/index.ts";

describe("index", () => {
  it("exports the eleven parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ClearTrigger",
      "Control",
      "Input",
      "Item",
      "ItemDeleteTrigger",
      "ItemInput",
      "ItemPreview",
      "ItemText",
      "Items",
      "Label",
      "Root",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of TagsInput was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
