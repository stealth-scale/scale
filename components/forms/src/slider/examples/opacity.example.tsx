import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Slider from "#slider/index.ts";

export function Opacity(): ReactElement {
  const { t } = useWords("slider");

  return (
    <Slider.Root
      defaultValue={[80]}
      formatOptions={{ style: "unit", unit: "percent" }}
      locale="en-GB"
      variant="subtle"
    >
      <Slider.Label>{t("opacity")}</Slider.Label>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb>
          <Slider.DraggingIndicator />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  );
}
