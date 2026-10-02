import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#menu/index.ts";

describe("index", () => {
  it("exports the twenty parts alone", () => {
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

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    // The root renders without a root above it, and the row's text and indicator need a row too.
    const { Item: _item, ItemIndicator: _mark, ItemText: _words, Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(parts, "A part of Menu was drawn outside the root that holds it together."),
    ).toStrictEqual([]);
  });

  it("throws for a row rendered outside a root", () => {
    expect(
      rootedViolations(
        { Item: barrel.Item },
        "A part of Menu was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });

  it("throws for a row's text or indicator rendered outside a row", () => {
    expect(
      rootedViolations(
        { ItemIndicator: barrel.ItemIndicator, ItemText: barrel.ItemText },
        "A part of Menu",
      ),
    ).toStrictEqual([]);
  });
});
