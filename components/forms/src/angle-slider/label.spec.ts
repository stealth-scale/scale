import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, thumb } from "#angle-slider/angle-slider.fixtures.tsx";

describe("Label", () => {
  it("renders a label element", async () => {
    await drawn(composed());

    expect(screen.getByText("Rotation").tagName).toBe("LABEL");
  });

  it("names the thumb while it is mounted", async () => {
    await drawn(composed());

    expect(thumb().getAttribute("aria-labelledby")).toBe(screen.getByText("Rotation").id);
  });

  it("leaves the thumb unnamed by it once it is unmounted", async () => {
    const { rerender } = await drawn(composed());

    rerender(composed({}, { labelled: false }));
    await settled();

    expect(screen.getByRole("slider").getAttribute("aria-labelledby")).toBeNull();
  });

  it("focuses the thumb on a press", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByText("Rotation"));
    await settled();

    expect(document.activeElement).toBe(thumb());
  });
});
