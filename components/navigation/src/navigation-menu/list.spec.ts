import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#navigation-menu/navigation-menu.fixtures.tsx";

describe("List", () => {
  it("renders a ul", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "list").tagName).toBe("UL");
  });

  it("sets the id the machine builds from the root's id", async () => {
    const { container } = await drawn(composed({ id: "site" }));

    expect(slotElement(container, "navigation-menu", "list").id).toBe("nav-menu:site:list");
  });

  it("sets data-orientation to the root's orientation", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "navigation-menu", "list").dataset["orientation"]).toBe(
      "vertical",
    );
  });

  it("defaults data-orientation to horizontal", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "list").dataset["orientation"]).toBe(
      "horizontal",
    );
  });
});
