import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("Tree", () => {
  it("renders an element with the tree role", async () => {
    await drawn(composed());

    expect(screen.getByRole("tree").tagName).toBe("DIV");
  });

  it("takes the name aria-label gives without a label", async () => {
    await drawn(composed({}, false));

    expect(screen.getByRole("tree", { name: "Project files" })).toBeTruthy();
  });

  it("drops the machine's own name", async () => {
    await drawn(composed());

    expect(screen.getByRole("tree").hasAttribute("aria-label")).toBe(false);
  });

  it("sets aria-multiselectable in multiple mode", async () => {
    await drawn(composed({ selectionMode: "multiple" }));

    expect(screen.getByRole("tree").getAttribute("aria-multiselectable")).toBe("true");
  });

  it("moves focus to the next row on ArrowDown", async () => {
    await drawn(composed());
    const first = screen.getByRole("treeitem", { name: "src" });

    act(() => {
      first.focus();
    });
    fireEvent.keyDown(first, { key: "ArrowDown" });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("treeitem", { name: "readme.md" }));
  });

  it("opens the focused branch on ArrowRight", async () => {
    await drawn(composed());
    const branch = screen.getByRole("treeitem", { name: "src" });

    act(() => {
      branch.focus();
    });
    fireEvent.keyDown(branch, { key: "ArrowRight" });
    await settled();

    expect(branch.getAttribute("aria-expanded")).toBe("true");
  });
});
