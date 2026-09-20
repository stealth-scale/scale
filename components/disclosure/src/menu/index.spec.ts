import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#menu/index.ts";

describe("index", () => {
  it("names every part and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Arrow",
      "ArrowTip",
      "Content",
      "ContextTrigger",
      "Indicator",
      "Item",
      "ItemCommand",
      "ItemDescription",
      "ItemGroup",
      "ItemGroupLabel",
      "ItemIndicator",
      "ItemLines",
      "ItemMark",
      "ItemText",
      "OptionItem",
      "Positioner",
      "Root",
      "Separator",
      "Trigger",
      "TriggerItem",
    ]);
  });

  it("publishes neither the recipe nor the binding nor the machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("refuses every part drawn outside the root that holds it together", () => {
    // The root runs without another above it, and the two parts inside a row need one of those too.
    const { Item: _item, ItemIndicator: _mark, ItemText: _words, Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(parts, "A part of Menu was drawn outside the root that holds it together."),
    ).toStrictEqual([]);
  });

  it("refuses a row drawn outside the root that holds it together", () => {
    expect(
      rootedViolations(
        { Item: barrel.Item },
        "A part of Menu was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });

  it("refuses the parts of a row drawn outside the row that holds them", () => {
    expect(
      rootedViolations(
        { ItemIndicator: barrel.ItemIndicator, ItemText: barrel.ItemText },
        "A part of Menu",
      ),
    ).toStrictEqual([]);
  });
});
