import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import { CloseTrigger } from "#tabs/close-trigger.tsx";
import { Content } from "#tabs/content.tsx";
import * as barrel from "#tabs/index.ts";
import { Indicator } from "#tabs/indicator.tsx";
import { List } from "#tabs/list.tsx";
import { Trigger } from "#tabs/trigger.tsx";

describe("index", () => {
  it("exports the six parts and selectionAfterClose alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "CloseTrigger",
      "Content",
      "Indicator",
      "List",
      "Root",
      "Trigger",
      "selectionAfterClose",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    expect(
      rootedViolations(
        { CloseTrigger, Content, Indicator, List, Trigger },
        "A part of Tabs was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
