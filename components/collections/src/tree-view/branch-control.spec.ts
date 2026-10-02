import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("BranchControl", () => {
  it("renders a div with the treeitem role", async () => {
    await drawn(composed());

    expect(screen.getByRole("treeitem", { name: "src" }).tagName).toBe("DIV");
  });

  it("opens its branch on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("treeitem", { name: "src" }));

    expect(screen.getByRole("treeitem", { name: "src" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("selects its branch on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("treeitem", { name: "src" }));

    expect(screen.getByRole("treeitem", { name: "src" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("keeps its branch closed on a press when expandOnClick is false", async () => {
    await drawn(composed({ expandOnClick: false }));
    await pressed(screen.getByRole("treeitem", { name: "src" }));

    expect(screen.getByRole("treeitem", { name: "src" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });
});
