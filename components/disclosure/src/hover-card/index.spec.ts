import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#hover-card/index.ts";

describe("index", () => {
  it("exports the six parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Arrow",
      "ArrowTip",
      "Content",
      "Positioner",
      "Root",
      "Trigger",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PresenceProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of HoverCard was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
