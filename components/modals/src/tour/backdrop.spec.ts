import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { started, stepped, steps, toured } from "#tour/tour.fixtures.tsx";

/**
 * Returns the backdrop, or null while it is out of the document.
 *
 * @param container - The rendered page.
 */
function backdrop(container: HTMLElement): HTMLElement | null {
  return container.querySelector(".tour__backdrop");
}

describe("Backdrop", () => {
  it("renders a div", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "backdrop").tagName).toBe("DIV");
  });

  it("renders nothing before the tour first opens", async () => {
    const { container } = await drawn(toured());

    expect(backdrop(container)).toBeNull();
  });

  it("shows on a dialog step", async () => {
    const { container } = await started();

    expect(backdrop(container)?.hidden).toBe(false);
  });

  it("covers the window on a dialog step", async () => {
    const { container } = await started();

    expect(backdrop(container)?.style.position).toBe("fixed");
  });

  it("places itself in the document on a tooltip step", async () => {
    const { container } = await started();

    await stepped("Start");

    expect(backdrop(container)?.style.position).toBe("absolute");
  });

  it("sets --tour-boundary to the height of the document the machine measures", async () => {
    const { container } = await started();

    expect(backdrop(container)?.style.getPropertyValue("--tour-boundary")).toMatch(/^\d+px$/u);
  });

  it("hides on a step with backdrop false", async () => {
    const { container } = await started({
      options: { steps: steps().map((step) => Object.assign(step, { backdrop: false })) },
    });

    expect(backdrop(container)?.hidden).toBe(true);
  });
});
