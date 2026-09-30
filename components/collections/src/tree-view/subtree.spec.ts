import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("Subtree", () => {
  it("renders a branch's container without a role", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tree-view", "branch").hasAttribute("role")).toBe(false);
  });

  it("renders an expanded branch's children in a group", async () => {
    await drawn(composed({ defaultExpandedValue: ["src"] }));

    expect(screen.getByRole("group").textContent).toContain("app.ts");
  });

  it("renders no group for a collapsed branch", async () => {
    await drawn(composed());

    expect(screen.queryByRole("group")).toBeNull();
  });
});
