import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("BranchText", () => {
  it("renders the branch's text in a span", async () => {
    const { container } = await drawn(composed());
    const text = slotElement(container, "tree-view", "branchText");

    expect([text.tagName, text.textContent]).toStrictEqual(["SPAN", "src"]);
  });
});
