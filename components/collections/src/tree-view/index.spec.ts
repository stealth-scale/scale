import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#tree-view/index.ts";

describe("index", () => {
  it("exports the fourteen parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "BranchControl",
      "BranchIndentGuide",
      "BranchIndicator",
      "BranchText",
      "BranchTrigger",
      "Item",
      "ItemIndicator",
      "ItemText",
      "Label",
      "NodeCheckbox",
      "NodeRenameInput",
      "Nodes",
      "Root",
      "Tree",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|MachineProvider|NodeProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of TreeView was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
