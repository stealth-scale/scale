import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#menubar/index.ts";

describe("index", () => {
  it("exports the four parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Content", "Menu", "Root", "Trigger"]);
  });

  it("throws for a menu or a name rendered outside a root", () => {
    expect(
      rootedViolations(
        { Menu: barrel.Menu, Trigger: barrel.Trigger },
        "A part of Menubar was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });

  it("throws for a panel rendered outside a menu", () => {
    expect(
      rootedViolations(
        { Content: barrel.Content },
        "A part of Menu was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
