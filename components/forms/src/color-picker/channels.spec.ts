import { type ColorChannel, type ColorFormat, parseColor } from "@zag-js/color-utils";
import { describe, expect, it } from "vitest";

import { CHANNEL_NAMES, channelText, formatOf, hexOf } from "#color-picker/channels.ts";

describe("channels", () => {
  it("names the hex input Hex", () => {
    expect(CHANNEL_NAMES.hex).toBe("Hex");
  });

  it("returns six hex digits for an opaque color", () => {
    expect(hexOf(parseColor("rgb(37, 99, 235)"))).toBe("#2563EB");
  });

  it("returns eight hex digits for a translucent color", () => {
    expect(hexOf(parseColor("rgba(37, 99, 235, 0.5)"))).toBe("#2563EB80");
  });

  it.each<{ channel: ColorChannel; current: ColorFormat; want: ColorFormat }>([
    { channel: "lightness", current: "rgba", want: "hsla" },
    { channel: "brightness", current: "hsla", want: "hsba" },
    { channel: "red", current: "hsba", want: "rgba" },
    { channel: "green", current: "hsba", want: "rgba" },
    { channel: "blue", current: "hsba", want: "rgba" },
    { channel: "alpha", current: "hsla", want: "hsla" },
    { channel: "hue", current: "hsla", want: "hsla" },
    { channel: "hue", current: "rgba", want: "hsba" },
    { channel: "saturation", current: "hsba", want: "hsba" },
  ])("returns $want for $channel while the format is $current", ({ channel, current, want }) => {
    expect(formatOf(channel, current)).toBe(want);
  });

  it("rounds a channel's text to its step", () => {
    expect(channelText(parseColor("#2563EB"), "hue", "en-US")).toBe("221°");
  });

  it("reads a channel in the format passed as format", () => {
    expect(channelText(parseColor("#2563EB"), "saturation", "en-US", "hsla")).toBe("83%");
  });

  it("formats a channel's text in the locale passed", () => {
    expect(channelText(parseColor("#2563EB"), "alpha", "de-DE")).toBe("100 %");
  });
});
