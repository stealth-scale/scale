import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("BranchIndentGuide", () => {
  it("hides the line from assistive technology", async () => {
    const { container } = await drawn(composed({ defaultExpandedValue: ["src"] }));

    expect(
      slotElement(container, "tree-view", "branchIndentGuide").getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("sets data-depth to its branch's depth", async () => {
    const { container } = await drawn(composed({ defaultExpandedValue: ["src"] }));

    expect(slotElement(container, "tree-view", "branchIndentGuide").dataset["depth"]).toBe("1");
  });
});
