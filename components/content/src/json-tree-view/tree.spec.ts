import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { composed } from "#json-tree-view/json-tree-view.fixtures.tsx";

describe("Tree", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultExpandedDepth: 2 }, { indentGuide: true })),
    ).resolves.toStrictEqual([]);
  });

  it("takes the name aria-label gives", async () => {
    await drawn(composed());

    expect(screen.getByRole("tree", { name: "Payout" })).toBeTruthy();
  });

  it("applies the tree classes of both recipes", async () => {
    await drawn(composed());

    expect([...screen.getByRole("tree").classList]).toStrictEqual(
      expect.arrayContaining([slotClass("json-tree-view", "tree"), slotClass("tree-view", "tree")]),
    );
  });

  it("renders a row for the value and for each of its keys", async () => {
    await drawn(composed());

    expect(screen.getAllByRole("treeitem")).toHaveLength(5);
  });

  it("renders an indent guide in every open group when indentGuide is true", async () => {
    const { container } = await drawn(composed({ defaultExpandedDepth: 2 }, { indentGuide: true }));

    expect(
      container.querySelectorAll(`.${slotClass("tree-view", "branchIndentGuide")}`),
    ).toHaveLength(3);
  });

  it("renders no indent guide by default", async () => {
    const { container } = await drawn(composed({ defaultExpandedDepth: 2 }));

    expect(
      container.querySelectorAll(`.${slotClass("tree-view", "branchIndentGuide")}`),
    ).toHaveLength(0);
  });
});
