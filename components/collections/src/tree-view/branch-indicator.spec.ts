import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("BranchIndicator", () => {
  it("hides the mark from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tree-view", "branchIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("sets data-state to open while its branch is open", async () => {
    const { container } = await drawn(composed({ defaultExpandedValue: ["src"] }));

    expect(slotElement(container, "tree-view", "branchIndicator").dataset["state"]).toBe("open");
  });

  it("sets data-state to closed while its branch is closed", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tree-view", "branchIndicator").dataset["state"]).toBe("closed");
  });
});
