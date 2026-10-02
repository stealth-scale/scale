import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import { CompletedContent } from "#steps/completed-content.tsx";
import { Content } from "#steps/content.tsx";
import * as barrel from "#steps/index.ts";
import { Item } from "#steps/item.tsx";
import { List } from "#steps/list.tsx";
import { NextTrigger } from "#steps/next-trigger.tsx";
import { PrevTrigger } from "#steps/prev-trigger.tsx";

describe("index", () => {
  it("exports the thirteen parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "CompletedContent",
      "Content",
      "Description",
      "Indicator",
      "Item",
      "List",
      "NextTrigger",
      "PrevTrigger",
      "Root",
      "Separator",
      "Status",
      "Title",
      "Trigger",
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
        { CompletedContent, Content, Item, List, NextTrigger, PrevTrigger },
        "A part of Steps was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
