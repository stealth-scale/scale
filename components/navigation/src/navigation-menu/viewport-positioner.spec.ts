import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { viewed } from "#navigation-menu/navigation-menu.fixtures.tsx";

describe("ViewportPositioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(viewed());

    expect(slotElement(container, "navigation-menu", "viewportPositioner").tagName).toBe("DIV");
  });

  it("sets data-align to center by default", async () => {
    const { container } = await drawn(viewed());

    expect(slotElement(container, "navigation-menu", "viewportPositioner").dataset["align"]).toBe(
      "center",
    );
  });

  it("sets data-align to the align it takes", async () => {
    const { container } = await drawn(viewed({}, { align: "start" }));

    expect(slotElement(container, "navigation-menu", "viewportPositioner").dataset["align"]).toBe(
      "start",
    );
  });

  it("provides its align to the viewport", async () => {
    const { container } = await drawn(viewed({}, { align: "end" }));

    expect(slotElement(container, "navigation-menu", "viewport").dataset["align"]).toBe("end");
  });
});
