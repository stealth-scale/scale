import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#toast/index.ts";

describe("index", () => {
  it("exports createToaster and the eight parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ActionTrigger",
      "CloseTrigger",
      "Content",
      "Description",
      "Indicator",
      "Region",
      "Root",
      "Title",
      "createToaster",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|ApiProvider)/u);
    }
  });

  it("throws for every part that reads a toast outside one", () => {
    const { ActionTrigger, CloseTrigger, Description, Root, Title } = barrel;

    expect(
      rootedViolations(
        { ActionTrigger, CloseTrigger, Description, Root, Title },
        "A part of Toast was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });

  it("creates a toaster whose toasts start empty", () => {
    expect(barrel.createToaster({}).getCount()).toBe(0);
  });
});
