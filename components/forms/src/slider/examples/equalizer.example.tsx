import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Fieldset from "#fieldset/index.ts";
import * as Slider from "#slider/index.ts";

const BANDS = [
  { band: "bass", gain: 4 },
  { band: "low", gain: 2 },
  { band: "mid", gain: 0 },
  { band: "high", gain: -2 },
  { band: "air", gain: 3 },
] as const;

export function Equalizer(): ReactElement {
  const { t } = useWords("slider");

  return (
    <Fieldset.Root>
      <Fieldset.Legend>{t("equalizer")}</Fieldset.Legend>
      <Stack direction="row" gap="xl">
        {BANDS.map(({ band, gain }) => (
          <Slider.Root
            defaultValue={[gain]}
            formatOptions={{ signDisplay: "exceptZero" }}
            key={band}
            max={12}
            min={-12}
            orientation="vertical"
            origin="center"
          >
            <Slider.ValueText />
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb />
            </Slider.Control>
            <Slider.Label>{t(`bands.${band}`)}</Slider.Label>
          </Slider.Root>
        ))}
      </Stack>
    </Fieldset.Root>
  );
}
