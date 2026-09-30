import { act, fireEvent, screen } from "@testing-library/react";
import { TreeCollection } from "@zag-js/collection";
import { setInteractionModality } from "@zag-js/focus-visible";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { ariaChecked } from "#tree-view/rows.ts";
import { composed, type FileNode } from "#tree-view/tree-view.fixtures.tsx";

/**
 * Branches of the fixture that the cases open.
 */
const OPEN = ["src", "lib"];

/**
 * Returns the focusable row named by the text given.
 *
 * @param name - The row's text.
 * @returns The row.
 */
function row(name: string): HTMLElement {
  return screen.getByRole("treeitem", { name });
}

describe("rows", () => {
  it.each([
    { checked: true, want: true },
    { checked: false, want: false },
    { checked: "indeterminate", want: "mixed" },
  ] as const)("returns $want from ariaChecked for $checked", ({ checked, want }) => {
    expect(ariaChecked(checked)).toBe(want);
  });

  it("gives a branch's focusable row the treeitem role", async () => {
    await drawn(composed());

    expect(row("src").classList).toContain("tree-view__branch-control");
  });

  it("sets aria-level from the node's depth", async () => {
    await drawn(composed({ defaultExpandedValue: OPEN }));

    expect(row("util.ts").getAttribute("aria-level")).toBe("3");
  });

  it("sets aria-posinset from the node's place among its siblings", async () => {
    await drawn(composed());

    expect(row("readme.md").getAttribute("aria-posinset")).toBe("2");
  });

  it("sets aria-setsize from the number of siblings", async () => {
    await drawn(composed({ defaultExpandedValue: OPEN }));

    expect(row("app.ts").getAttribute("aria-setsize")).toBe("2");
  });

  it("sets aria-expanded on a branch's row", async () => {
    await drawn(composed({ defaultExpandedValue: OPEN }));

    expect(row("src").getAttribute("aria-expanded")).toBe("true");
  });

  it("leaves aria-expanded off an item's row", async () => {
    await drawn(composed());

    expect(row("readme.md").hasAttribute("aria-expanded")).toBe(false);
  });

  it("sets aria-disabled on a disabled row", async () => {
    await drawn(composed());

    expect(row("locked.md").getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves aria-selected off a disabled row", async () => {
    await drawn(composed());

    expect(row("locked.md").hasAttribute("aria-selected")).toBe(false);
  });

  it("sets aria-checked in a checkable tree", async () => {
    await drawn(composed({ checkable: true, defaultCheckedValue: ["app.ts"] }));

    expect(row("src").getAttribute("aria-checked")).toBe("mixed");
  });

  it("leaves aria-checked out of a tree that is not checkable", async () => {
    await drawn(composed());

    expect(row("src").hasAttribute("aria-checked")).toBe(false);
  });

  it("toggles the check on Space in a checkable tree", async () => {
    const told = vi.fn<(details: { readonly checkedValue: string[] }) => void>();

    await drawn(composed({ checkable: true, onCheckedChange: told }));
    fireEvent.keyDown(row("readme.md"), { key: " " });
    await settled();

    expect(told).toHaveBeenLastCalledWith({ checkedValue: ["readme.md"] });
  });

  it("leaves the selection alone on Space in a checkable tree", async () => {
    await drawn(composed({ checkable: true }));
    fireEvent.keyDown(row("readme.md"), { key: " " });
    await settled();

    expect(row("readme.md").getAttribute("aria-selected")).toBe("false");
  });

  it("selects on Space in a tree that is not checkable", async () => {
    await drawn(composed());
    fireEvent.keyDown(row("readme.md"), { key: " " });
    await settled();

    expect(row("readme.md").getAttribute("aria-selected")).toBe("true");
  });

  it("ignores Space on a disabled row in a checkable tree", async () => {
    const told = vi.fn<(details: { readonly checkedValue: string[] }) => void>();

    await drawn(composed({ checkable: true, onCheckedChange: told }));
    fireEvent.keyDown(row("locked.md"), { key: " " });
    await settled();

    expect(told).not.toHaveBeenCalled();
  });

  it("sets aria-busy while a branch loads its children", async () => {
    const pending = new Promise<FileNode[]>(() => {});
    const remote = new TreeCollection<FileNode>({
      nodeToString: (node): string => node.value,
      nodeToValue: (node): string => node.value,
      rootNode: { children: [{ childrenCount: 2, value: "remote" }], value: "root" },
    });

    await drawn(composed({ collection: remote, loadChildren: () => pending }));
    await pressed(row("remote"));

    expect(row("remote").getAttribute("aria-busy")).toBe("true");
  });

  it("marks a row focused from the keyboard with data-focus-visible", async () => {
    await drawn(composed());
    setInteractionModality("keyboard");
    act(() => {
      row("readme.md").focus();
    });
    await settled();

    expect(row("readme.md").dataset["focusVisible"]).toBe("");
  });

  it("leaves the mark off a row focused by a pointer", async () => {
    await drawn(composed());
    fireEvent.pointerDown(row("readme.md"));
    act(() => {
      row("readme.md").focus();
    });
    await settled();

    expect(row("readme.md").dataset["focusVisible"]).toBeUndefined();
  });

  it("removes the mark when the row loses focus", async () => {
    await drawn(composed());
    setInteractionModality("keyboard");
    act(() => {
      row("readme.md").focus();
    });
    await settled();
    act(() => {
      row("readme.md").blur();
    });
    await settled();

    expect(row("readme.md").dataset["focusVisible"]).toBeUndefined();
  });
});
