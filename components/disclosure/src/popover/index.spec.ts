import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#popover/index.ts";

describe("index", () => {
  it("exports the eleven parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Anchor",
      "Arrow",
      "ArrowTip",
      "CloseTrigger",
      "Content",
      "Description",
      "Indicator",
      "Positioner",
      "Root",
      "Title",
      "Trigger",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    // The root is the one part that renders without a root above it.
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of Popover was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
