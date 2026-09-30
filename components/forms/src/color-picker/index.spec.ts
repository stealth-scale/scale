import { describe, expect, it } from "vitest";

import * as barrel from "#color-picker/index.ts";

describe("index", () => {
  it("exports the twenty-four parts and parseColor", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Area",
      "AreaBackground",
      "AreaThumb",
      "ChannelInput",
      "ChannelSlider",
      "ChannelSliderLabel",
      "ChannelSliderThumb",
      "ChannelSliderTrack",
      "ChannelSliderValueText",
      "Content",
      "Control",
      "EyeDropperTrigger",
      "FormatTrigger",
      "Label",
      "Positioner",
      "Root",
      "Swatch",
      "SwatchGroup",
      "SwatchIndicator",
      "SwatchTrigger",
      "Trigger",
      "ValueSwatch",
      "ValueText",
      "View",
      "parseColor",
    ]);
  });
});
