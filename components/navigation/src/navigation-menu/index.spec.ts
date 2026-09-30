import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#navigation-menu/index.ts";

describe("index", () => {
  it("exports the nine parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Indicator",
      "Item",
      "Link",
      "List",
      "Root",
      "Trigger",
      "Viewport",
      "ViewportPositioner",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of NavigationMenu was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
