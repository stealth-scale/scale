import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { started, stepped, toured } from "#tour/tour.fixtures.tsx";

/**
 * Returns the spotlight, or null while it is out of the document.
 *
 * @param container - The rendered page.
 */
function spotlight(container: HTMLElement): HTMLElement | null {
  return container.querySelector(".tour__spotlight");
}

describe("Spotlight", () => {
  it("renders a div", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "spotlight").tagName).toBe("DIV");
  });

  it("renders nothing before the tour first opens", async () => {
    const { container } = await drawn(toured());

    expect(spotlight(container)).toBeNull();
  });

  it("hides on a step without a target", async () => {
    const { container } = await started();

    expect(spotlight(container)?.hidden).toBe(true);
  });

  it("shows on a step with a target", async () => {
    const { container } = await started();

    await stepped("Start");

    expect(spotlight(container)?.hidden).toBe(false);
  });

  it("takes no pointer events", async () => {
    const { container } = await started();

    await stepped("Start");

    expect(spotlight(container)?.style.pointerEvents).toBe("none");
  });
});
