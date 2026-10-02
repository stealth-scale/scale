import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import {
  boundMachineViolations,
  slotClass,
  slotElement,
  slotVariantClass,
} from "@stealthscale/testing-theme";

import { valueOf } from "#json-tree-view/collection.ts";
import { composed, keyOf, rowOf } from "#json-tree-view/json-tree-view.fixtures.tsx";
import { recipe } from "#json-tree-view/recipe.ts";
import { type RootProps } from "#json-tree-view/root.tsx";

/**
 * Returns a fixed string. A value that contains it renders it as a branch.
 */
function settle(): string {
  return "settled";
}

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultExpandedDepth: 3 })),
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

  it("sets data-recipe to json-tree-view", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "json-tree-view", "root").dataset["recipe"]).toBe(
      "json-tree-view",
    );
  });

  it("opens the value's own branch by default", async () => {
    await drawn(composed());

    expect(
      screen.getAllByRole("treeitem").map((row) => row.getAttribute("aria-expanded")),
    ).toStrictEqual(["true", null, null, "false", "false"]);
  });

  it("opens every branch down to defaultExpandedDepth", async () => {
    await drawn(composed({ defaultExpandedDepth: 2 }));

    expect(rowOf("destination").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens nothing when defaultExpandedDepth is 0", async () => {
    await drawn(composed({ defaultExpandedDepth: 0 }));

    expect(screen.getAllByRole("treeitem")).toHaveLength(1);
  });

  it("sets the tree view's size to sm by default", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tree-view", "root").classList).toContain(
      slotVariantClass("tree-view", "root", "size", "sm"),
    );
  });

  it("passes its size to the tree view", async () => {
    const { container } = await drawn(composed({ size: "md" }));

    expect(slotElement(container, "tree-view", "root").classList).toContain(
      slotVariantClass("tree-view", "root", "size", "md"),
    );
  });

  it("sets the tree view's plain selected look", async () => {
    await drawn(composed());

    expect(rowOf("amount").classList).toContain(
      slotVariantClass("tree-view", "item", "selected", "plain"),
    );
  });

  it("splits an array into branches of groupArraysAfterLength items", async () => {
    await drawn(
      composed({
        data: { list: [1, 2, 3, 4, 5] },
        defaultExpandedDepth: 2,
        groupArraysAfterLength: 2,
      }),
    );

    expect(screen.getAllByRole("treeitem").map((row) => keyOf(row))).toStrictEqual([
      "",
      "list",
      "[0…1]",
      "[2…3]",
      "[4…4]",
      "length",
    ]);
  });

  it("lists maxPreviewItems entries in a collapsed branch's preview", async () => {
    await drawn(composed({ maxPreviewItems: 1 }));

    expect(
      rowOf("destination").querySelector(`.${slotClass("tree-view", "branchText")}`)?.textContent,
    ).toBe('destination: { bank: "Northwind Bank", … }');
  });

  it("leaves out a function's source when showNonenumerable is false", async () => {
    await drawn(composed({ data: { settle }, defaultExpandedDepth: 2, showNonenumerable: false }));

    expect(screen.getAllByRole("treeitem").map((row) => keyOf(row))).not.toContain("[[Function]]");
  });

  it("calls onSelectionChange with the pressed row's value", async () => {
    const told = vi.fn<(details: { readonly selectedValue: string[] }) => void>();

    await drawn(composed({ onSelectionChange: told }));
    await pressed(rowOf("amount"));

    expect(told).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedValue: [valueOf({ keyPath: ["$", "amount"], type: "number", value: 4200 })],
      }),
    );
  });
});
