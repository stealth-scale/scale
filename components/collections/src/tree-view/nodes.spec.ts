import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("Nodes", () => {
  it("renders a row for every top-level node", async () => {
    await drawn(composed());

    expect(
      screen.getAllByRole("treeitem").map((row) => row.textContent?.replaceAll(/[›✓•]/gu, "")),
    ).toStrictEqual(["src", "readme.md", "locked.md"]);
  });

  it("renders the rows under an expanded branch", async () => {
    await drawn(composed({ defaultExpandedValue: ["src", "lib"] }));

    expect(screen.getAllByRole("treeitem")).toHaveLength(6);
  });

  it("renders the indent guide in every open group", async () => {
    const { container } = await drawn(composed({ defaultExpandedValue: ["src", "lib"] }));

    expect(
      container.querySelectorAll(`.${slotClass("tree-view", "branchIndentGuide")}`),
    ).toHaveLength(2);
  });
});
