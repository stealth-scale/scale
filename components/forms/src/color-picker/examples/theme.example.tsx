import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as ColorPicker from "#color-picker/index.ts";

export function Theme(): ReactElement {
  const { t } = useWords("color-picker");

  return (
    <ColorPicker.Root defaultValue="#7C3AED" inline>
      <ColorPicker.Label>{t("theme.label")}</ColorPicker.Label>
      <ColorPicker.Content>
        <ColorPicker.Area>
          <ColorPicker.AreaBackground />
          <ColorPicker.AreaThumb />
        </ColorPicker.Area>
        <ColorPicker.ChannelSlider channel="hue">
          <ColorPicker.ChannelSliderTrack>
            <ColorPicker.ChannelSliderThumb />
          </ColorPicker.ChannelSliderTrack>
        </ColorPicker.ChannelSlider>
        <Stack direction="row" gap="sm">
          <ColorPicker.ValueSwatch size="xl" />
          <ColorPicker.ChannelInput channel="hex" />
        </Stack>
      </ColorPicker.Content>
    </ColorPicker.Root>
  );
}
