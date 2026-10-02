import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#tree-view/recipe.ts";
import { type RootProps } from "#tree-view/root.tsx";
import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultExpandedValue: ["src", "lib"] })),
    ).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a checkable tree", async () => {
    await expect(
      accessibilityViolations(() => composed({ checkable: true, defaultCheckedValue: ["app.ts"] })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div without a role", async () => {
    const { container } = await drawn(composed());
    const root = slotElement(container, "tree-view", "root");

    expect([root.tagName, root.hasAttribute("role")]).toStrictEqual(["DIV", false]);
  });

  it("opens the branches defaultExpandedValue names", async () => {
    await drawn(composed({ defaultExpandedValue: ["src"] }));

    expect(screen.getByRole("treeitem", { name: "app.ts" })).toBeTruthy();
  });

  it("calls onSelectionChange with the pressed row", async () => {
    const told = vi.fn<(details: { readonly selectedValue: string[] }) => void>();

    await drawn(composed({ onSelectionChange: told }));
    await pressed(screen.getByRole("treeitem", { name: "readme.md" }));

    expect(told).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedValue: ["readme.md"] }),
    );
  });

  it("calls onExpandedChange with the opened branch", async () => {
    const told = vi.fn<(details: { readonly expandedValue: string[] }) => void>();

    await drawn(composed({ onExpandedChange: told }));
    await pressed(screen.getByRole("treeitem", { name: "src" }));

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ expandedValue: ["src"] }));
  });

  it("keeps a controlled expansion on a press", async () => {
    await drawn(composed({ expandedValue: [] }));
    await pressed(screen.getByRole("treeitem", { name: "src" }));

    expect(screen.getByRole("treeitem", { name: "src" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });
});
