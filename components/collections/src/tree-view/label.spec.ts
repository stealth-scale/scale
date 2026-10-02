import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

describe("Label", () => {
  it("renders its words", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tree-view", "label").textContent).toBe("Files");
  });

  it("names the tree while it is mounted", async () => {
    await drawn(composed());

    expect(screen.getByRole("tree", { name: "Files" })).toBeTruthy();
  });

  it("leaves aria-labelledby off the tree while no label is mounted", async () => {
    await drawn(composed({}, false));

    expect(screen.getByRole("tree").hasAttribute("aria-labelledby")).toBe(false);
  });
});
