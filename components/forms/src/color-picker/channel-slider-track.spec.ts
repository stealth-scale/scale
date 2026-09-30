import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picker, slider } from "#color-picker/color-picker.fixtures.tsx";

describe("ChannelSliderTrack", () => {
  it("renders a div with role group", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "channelSliderTrack").getAttribute("role")).toBe(
      "group",
    );
  });

  it("writes its gradient into --color-picker-gradient", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(
      slotElement(container, "color-picker", "channelSliderTrack").style.getPropertyValue(
        "--color-picker-gradient",
      ),
    ).toContain("linear-gradient");
  });

  it("leaves the gradient out of its inline background", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "channelSliderTrack").style.backgroundImage).toBe(
      "",
    );
  });

  it("moves the hue to the point a press lands on", async () => {
    const { container } = await drawn(picker());

    await opened();

    const track = slotElement(container, "color-picker", "channelSliderTrack");

    vi.spyOn(track, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 360, 12));
    fireEvent.pointerDown(track, { button: 0, clientX: 90, clientY: 6 });
    await settled();

    expect(slider("Hue").getAttribute("aria-valuenow")).toBe("90");
  });
});
