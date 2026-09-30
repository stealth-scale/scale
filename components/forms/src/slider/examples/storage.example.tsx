import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Slider from "#slider/index.ts";

const BYTES = new Intl.NumberFormat("en-GB", { style: "unit", unit: "gigabyte" });

const TIERS = [0, 250, 500, 750, 1000];

export function Storage(): ReactElement {
  const { t } = useWords("slider");

  return (
    <Slider.Root
      defaultValue={[250]}
      formatOptions={{ style: "unit", unit: "gigabyte" }}
      locale="en-GB"
      max={1000}
      step={250}
    >
      <Slider.Label>{t("storage")}</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.MarkerGroup>
          {TIERS.map((tier) => (
            <Slider.Marker key={tier} value={tier}>
              {BYTES.format(tier)}
            </Slider.Marker>
          ))}
        </Slider.MarkerGroup>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>
  );
}
