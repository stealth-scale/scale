import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { opened, picker, slider } from "#color-picker/color-picker.fixtures.tsx";

describe("ChannelSliderLabel", () => {
  it("renders a span with its words", async () => {
    await drawn(picker());
    await opened();

    expect(screen.getByText("Hue").tagName).toBe("SPAN");
  });

  it("moves focus to the thumb on a press", async () => {
    await drawn(picker());
    await opened();

    fireEvent.click(screen.getByText("Hue"));
    await settled();

    expect(document.activeElement).toBe(slider("Hue"));
  });
});
