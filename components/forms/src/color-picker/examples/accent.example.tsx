import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ColorPicker from "#color-picker/index.ts";

export function Accent(): ReactElement {
  const { t } = useWords("color-picker");
  const [color, setColor] = useState(() => ColorPicker.parseColor("#0D9488"));
  const [saved, setSaved] = useState("#0D9488");

  return (
    <Stack align="flex-start" gap="md">
      <ColorPicker.Root
        onValueChange={({ value }) => {
          setColor(value);
        }}
        onValueChangeEnd={({ value }) => {
          setSaved(value.toString("hex"));
        }}
        positioning={{ placement: "bottom-start" }}
        value={color}
      >
        <ColorPicker.Label>{t("accent.label")}</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Trigger>
            <ColorPicker.ValueSwatch size="lg" />
            <ColorPicker.ValueText format="hex" />
          </ColorPicker.Trigger>
        </ColorPicker.Control>
        {createPortal(
          <ColorPicker.Positioner>
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
            </ColorPicker.Content>
          </ColorPicker.Positioner>,
          document.body,
        )}
      </ColorPicker.Root>
      <Text as="output">{t("accent.live", { color: color.toString("hex") })}</Text>
      <Text as="output">{t("accent.saved", { color: saved })}</Text>
    </Stack>
  );
}
