import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#floating-panel/floating-panel.fixtures.tsx";

/**
 * Returns the positioner of the rendered panel.
 *
 * @param container - The render's container.
 */
function positioner(container: HTMLElement): HTMLElement {
  return slotElement(container, "floating-panel", "positioner");
}

describe("Positioner", () => {
  it("renders nothing while the panel has not opened", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector("[data-part=positioner]")).toBeNull();
  });

  it("renders a div with the positioner class around the panel", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(positioner(container).tagName).toBe("DIV");
  });

  it("fixes itself to the window through the machine's inline position", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(positioner(container).style.position).toBe("fixed");
  });

  it("writes the place and the size the machine stores", async () => {
    const { container } = await drawn(
      composed({
        defaultOpen: true,
        defaultPosition: { x: 40, y: 60 },
        defaultSize: { height: 200, width: 300 },
      }),
    );
    const { style } = positioner(container);

    expect(
      ["--x", "--y", "--width", "--height"].map((name) => style.getPropertyValue(name)),
    ).toStrictEqual(["40px", "60px", "300px", "200px"]);
  });

  it("writes the panel's place in the stack of open panels as --z-index", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(positioner(container).style.getPropertyValue("--z-index")).toBe("1");
  });

  it("drops the machine's inline z-index", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(positioner(container).style.zIndex).toBe("");
  });
});
