import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as AngleSlider from "#angle-slider/index.ts";

const QUARTERS = [0, 90, 180, 270];

export function Rotation(props: AngleSlider.RootProps): ReactElement {
  const { t } = useWords("angle-slider");

  return (
    <AngleSlider.Root defaultValue={45} locale="en-GB" {...props}>
      <AngleSlider.Label>{t("rotation")}</AngleSlider.Label>
      <AngleSlider.Control>
        <AngleSlider.Track>
          <AngleSlider.Range />
        </AngleSlider.Track>
        <AngleSlider.MarkerGroup>
          {QUARTERS.map((value) => (
            <AngleSlider.Marker key={value} value={value} />
          ))}
        </AngleSlider.MarkerGroup>
        <AngleSlider.Thumb />
        <AngleSlider.ValueText />
      </AngleSlider.Control>
    </AngleSlider.Root>
  );
}
