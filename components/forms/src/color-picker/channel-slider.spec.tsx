import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ChannelSliderLabel } from "#color-picker/channel-slider-label.tsx";
import { ChannelSliderThumb } from "#color-picker/channel-slider-thumb.tsx";
import { ChannelSliderTrack } from "#color-picker/channel-slider-track.tsx";
import { ChannelSlider } from "#color-picker/channel-slider.tsx";
import { opened, picker, slider } from "#color-picker/color-picker.fixtures.tsx";

describe("ChannelSlider", () => {
  it("renders a div for its channel", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "channelSlider").dataset["channel"]).toBe("hue");
  });

  it("reads a channel in the format that has it", async () => {
    await drawn(
      picker(
        {},
        {
          panel: (
            <ChannelSlider channel="red">
              <ChannelSliderTrack>
                <ChannelSliderThumb />
              </ChannelSliderTrack>
            </ChannelSlider>
          ),
        },
      ),
    );
    await opened();

    expect(slider("Red").getAttribute("aria-valuemax")).toBe("255");
  });

  it("reads a channel in the format passed as format", async () => {
    await drawn(
      picker(
        {},
        {
          panel: (
            <ChannelSlider channel="saturation" format="hsla">
              <ChannelSliderTrack>
                <ChannelSliderThumb />
              </ChannelSliderTrack>
            </ChannelSlider>
          ),
        },
      ),
    );
    await opened();

    expect(slider("Saturation").getAttribute("aria-valuetext")).toBe("83%");
  });

  it("moves nothing on a press on its label", async () => {
    await drawn(
      picker(
        {},
        {
          panel: (
            <ChannelSlider channel="hue">
              <ChannelSliderLabel>Hue</ChannelSliderLabel>
              <ChannelSliderTrack>
                <ChannelSliderThumb label="Hue thumb" />
              </ChannelSliderTrack>
            </ChannelSlider>
          ),
        },
      ),
    );
    await opened();

    fireEvent.pointerDown(screen.getByText("Hue"), { button: 0, clientX: 0, clientY: 0 });
    await settled();

    expect(slider("Hue thumb").getAttribute("aria-valuetext")).toBe("221°");
  });
});
