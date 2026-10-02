import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#floating-panel/floating-panel.fixtures.tsx";

/**
 * Returns the control of the rendered panel.
 *
 * @param container - The render's container.
 */
function control(container: HTMLElement): HTMLElement {
  return slotElement(container, "floating-panel", "control");
}

describe("Control", () => {
  it("renders a div with the control class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(control(container).tagName).toBe("DIV");
  });

  it("writes data-stage default while the panel is at its size", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(control(container).dataset["stage"]).toBe("default");
  });

  it("writes data-stage minimized while the panel is minimized", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));
    await pressed(screen.getByRole("button", { name: "Minimize" }));

    expect(control(container).dataset["stage"]).toBe("minimized");
  });
});
