import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Slider from "#slider/index.ts";

export function Volume(props: Slider.RootProps): ReactElement {
  const { t } = useWords("slider");

  return (
    <Slider.Root
      defaultValue={[40]}
      formatOptions={{ style: "unit", unit: "percent" }}
      locale="en-GB"
      {...props}
    >
      <Slider.Label>{t("volume")}</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>
  );
}
