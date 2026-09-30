import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, PipetteIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as ColorPicker from "#color-picker/index.ts";

const CHANNELS = ["hue", "alpha"] as const;

const PRESETS = [
  { name: "blue", value: "#2563EB" },
  { name: "teal", value: "#0D9488" },
  { name: "green", value: "#16A34A" },
  { name: "amber", value: "#D97706" },
  { name: "red", value: "#DC2626" },
  { name: "violet", value: "#7C3AED" },
] as const;

export function Brand(props: ColorPicker.RootProps): ReactElement {
  const { t } = useWords("color-picker");

  return (
    <ColorPicker.Root defaultValue="#2563EB" {...props}>
      <ColorPicker.Label>{t("brand.label")}</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.ChannelInput channel="hex" />
        <ColorPicker.EyeDropperTrigger label={t("brand.pick")}>
          <PipetteIcon />
        </ColorPicker.EyeDropperTrigger>
        <ColorPicker.Trigger>
          <ColorPicker.ValueSwatch />
        </ColorPicker.Trigger>
      </ColorPicker.Control>
      {createPortal(
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area>
              <ColorPicker.AreaBackground />
              <ColorPicker.AreaThumb />
            </ColorPicker.Area>
            {CHANNELS.map((channel) => (
              <ColorPicker.ChannelSlider channel={channel} key={channel}>
                <ColorPicker.ChannelSliderTrack>
                  <ColorPicker.ChannelSliderThumb />
                </ColorPicker.ChannelSliderTrack>
              </ColorPicker.ChannelSlider>
            ))}
            <ColorPicker.SwatchGroup aria-label={t("brand.presets")}>
              {PRESETS.map(({ name, value }) => (
                <ColorPicker.SwatchTrigger key={name} label={t(`colors.${name}`)} value={value}>
                  <ColorPicker.Swatch />
                  <ColorPicker.SwatchIndicator>
                    <CheckIcon />
                  </ColorPicker.SwatchIndicator>
                </ColorPicker.SwatchTrigger>
              ))}
            </ColorPicker.SwatchGroup>
          </ColorPicker.Content>
        </ColorPicker.Positioner>,
        document.body,
      )}
    </ColorPicker.Root>
  );
}
