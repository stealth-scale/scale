import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Slider from "#slider/index.ts";

export function Price(): ReactElement {
  const { t } = useWords("slider");

  return (
    <Slider.Root
      defaultValue={[100, 350]}
      formatOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
      locale="en-GB"
      max={500}
      minStepsBetweenThumbs={5}
      name="price"
      step={10}
    >
      <Slider.Label>{t("price")}</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} label={t("minimum")} />
        <Slider.Thumb index={1} label={t("maximum")} />
      </Slider.Control>
    </Slider.Root>
  );
}
