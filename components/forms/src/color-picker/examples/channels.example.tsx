import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as ColorPicker from "#color-picker/index.ts";
import * as SegmentGroup from "#segment-group/index.ts";

const FORMATS = [
  { channels: ["red", "green", "blue", "alpha"], format: "rgba" },
  { channels: ["hue", "saturation", "lightness", "alpha"], format: "hsla" },
  { channels: ["hue", "saturation", "brightness", "alpha"], format: "hsba" },
] as const;

export function Channels(): ReactElement {
  const { t } = useWords("color-picker");
  const [format, setFormat] = useState<ColorPicker.ColorFormat>("rgba");

  return (
    <ColorPicker.Root defaultValue="#D97706" format={format} inline>
      <ColorPicker.Label>{t("channels.label")}</ColorPicker.Label>
      <ColorPicker.Content>
        <SegmentGroup.Root
          aria-label={t("channels.format")}
          onValueChange={({ value }) => {
            setFormat(FORMATS.find((entry) => entry.format === value)?.format ?? "rgba");
          }}
          value={format}
        >
          {FORMATS.map((entry) => (
            <SegmentGroup.Item key={entry.format} value={entry.format}>
              <SegmentGroup.ItemText>{t(`formats.${entry.format}`)}</SegmentGroup.ItemText>
            </SegmentGroup.Item>
          ))}
        </SegmentGroup.Root>
        {FORMATS.map((entry) => (
          <ColorPicker.View format={entry.format} key={entry.format}>
            {entry.channels.map((channel) => (
              <ColorPicker.ChannelSlider channel={channel} key={channel}>
                <ColorPicker.ChannelSliderLabel>
                  {t(`channels.${channel}`)}
                </ColorPicker.ChannelSliderLabel>
                <ColorPicker.ChannelSliderValueText />
                <ColorPicker.ChannelSliderTrack>
                  <ColorPicker.ChannelSliderThumb label={t(`channels.${channel}`)} />
                </ColorPicker.ChannelSliderTrack>
              </ColorPicker.ChannelSlider>
            ))}
            <Stack direction="row" gap="xs">
              {entry.channels.map((channel) => (
                <ColorPicker.ChannelInput
                  channel={channel}
                  key={channel}
                  label={t(`channels.${channel}`)}
                />
              ))}
            </Stack>
          </ColorPicker.View>
        ))}
      </ColorPicker.Content>
    </ColorPicker.Root>
  );
}
