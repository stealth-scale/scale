import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#accordion/index.ts";
import { ItemContent } from "#accordion/item-content.tsx";
import { ItemIndicator } from "#accordion/item-indicator.tsx";
import { ItemTrigger } from "#accordion/item-trigger.tsx";
import { Item } from "#accordion/item.tsx";

describe("index", () => {
  it("exports the seven parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Item",
      "ItemBody",
      "ItemContent",
      "ItemHeading",
      "ItemIndicator",
      "ItemTrigger",
      "Root",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|MachineProvider|ItemProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    expect(
      rootedViolations(
        { Item, ItemContent, ItemIndicator, ItemTrigger },
        "A part of Accordion was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
