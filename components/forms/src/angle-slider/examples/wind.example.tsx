import { type ReactElement, useState } from "react";

import { useWords } from "@stealthscale/specimen";

import * as AngleSlider from "#angle-slider/index.ts";

const POINTS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"] as const;

const STEP = 45;

export function Wind(): ReactElement {
  const { t } = useWords("angle-slider");
  const [heading, setHeading] = useState(90);
  const point = POINTS[Math.round(heading / STEP) % POINTS.length] ?? "n";

  return (
    <AngleSlider.Root
      locale="en-GB"
      onValueChange={({ value }) => {
        setHeading(value);
      }}
      step={STEP}
      value={heading}
    >
      <AngleSlider.Label>{t("wind")}</AngleSlider.Label>
      <AngleSlider.Control>
        <AngleSlider.Track />
        <AngleSlider.MarkerGroup>
          {POINTS.map((each, index) => (
            <AngleSlider.Marker key={each} value={index * STEP} />
          ))}
        </AngleSlider.MarkerGroup>
        <AngleSlider.Thumb aria-valuetext={t(`points.${point}`)} />
        <AngleSlider.ValueText>{t(`points.${point}`)}</AngleSlider.ValueText>
      </AngleSlider.Control>
    </AngleSlider.Root>
  );
}
