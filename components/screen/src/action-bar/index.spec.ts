import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#action-bar/index.ts";

describe("index", () => {
  it("exports the four parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "CloseTrigger",
      "Content",
      "Positioner",
      "Root",
    ]);
  });

  it("throws for every part that reads the bar rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of ActionBar was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
