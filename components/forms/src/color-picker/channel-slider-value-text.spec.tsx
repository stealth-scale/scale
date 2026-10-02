import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ChannelSliderValueText } from "#color-picker/channel-slider-value-text.tsx";
import { ChannelSlider } from "#color-picker/channel-slider.tsx";
import { opened, picker } from "#color-picker/color-picker.fixtures.tsx";

describe("ChannelSliderValueText", () => {
  it("renders the channel's value at the precision of its step", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "channelSliderValueText").textContent).toBe(
      "221°",
    );
  });

  it("renders its children in place of the value", async () => {
    await drawn(
      picker(
        {},
        {
          panel: (
            <ChannelSlider channel="hue">
              <ChannelSliderValueText>Blue</ChannelSliderValueText>
            </ChannelSlider>
          ),
        },
      ),
    );
    await opened();

    expect(screen.getByText("Blue").tagName).toBe("SPAN");
  });
});
