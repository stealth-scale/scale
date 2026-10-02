import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("BranchTrigger", () => {
  it("hides the trigger from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tree-view", "branchTrigger").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("leaves the machine's button role out", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tree-view", "branchTrigger").hasAttribute("role")).toBe(false);
  });

  it("opens its branch on a press when expandOnClick is false", async () => {
    const { container } = await drawn(composed({ expandOnClick: false }));

    await pressed(slotElement(container, "tree-view", "branchTrigger"));

    expect(screen.getByRole("treeitem", { name: "src" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("leaves the selection alone on a press", async () => {
    const { container } = await drawn(composed({ expandOnClick: false }));

    await pressed(slotElement(container, "tree-view", "branchTrigger"));

    expect(screen.getByRole("treeitem", { name: "src" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });
});
