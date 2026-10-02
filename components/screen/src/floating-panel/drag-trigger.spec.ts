import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, panel } from "#floating-panel/floating-panel.fixtures.tsx";

/**
 * Returns the drag trigger of the rendered panel.
 *
 * @param container - The render's container.
 */
function dragTrigger(container: HTMLElement): HTMLElement {
  return slotElement(container, "floating-panel", "dragTrigger");
}

describe("DragTrigger", () => {
  it("renders a div with the drag trigger class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(dragTrigger(container).tagName).toBe("DIV");
  });

  it("drops the machine's inline cursor", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(dragTrigger(container).getAttribute("style")).toBeNull();
  });

  it("sets data-disabled when draggable is false", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, draggable: false }));

    expect(dragTrigger(container).dataset["disabled"]).toBe("");
  });

  it("maximizes the panel on a double click", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));
    fireEvent.doubleClick(dragTrigger(container));
    await settled();

    expect(panel().dataset["maximized"]).toBe("");
  });

  it("sets data-disabled while the panel is maximized", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    await settled();

    expect(dragTrigger(container).dataset["disabled"]).toBe("");
  });
});
