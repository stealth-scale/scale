import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, thumb } from "#slider/slider.fixtures.tsx";

describe("Control", () => {
  it("renders a div around the track and the thumb", async () => {
    const { container } = await drawn(composed());
    const control = slotElement(container, "slider", "control");

    expect([control.tagName, control.contains(thumb())]).toStrictEqual(["DIV", true]);
  });

  it("moves the thumb to the value a press on it lands on", async () => {
    const { container } = await drawn(composed());
    const control = slotElement(container, "slider", "control");

    vi.spyOn(control, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ height: 24, width: 200, x: 0, y: 0 }),
    );
    fireEvent.pointerDown(control, { button: 0, clientX: 150, clientY: 12 });
    await settled();

    expect(thumb().getAttribute("aria-valuenow")).toBe("75");
  });
});
