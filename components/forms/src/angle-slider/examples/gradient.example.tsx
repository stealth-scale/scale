import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Code } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AngleSlider from "#angle-slider/index.ts";

export function Gradient(): ReactElement {
  const { t } = useWords("angle-slider");
  const [angle, setAngle] = useState(135);

  return (
    <Stack align="flex-start" gap="md">
      <AngleSlider.Root
        locale="en-GB"
        onValueChange={({ value }) => {
          setAngle(value);
        }}
        step={5}
        value={angle}
      >
        <AngleSlider.Label>{t("gradient")}</AngleSlider.Label>
        <AngleSlider.Control>
          <AngleSlider.Track>
            <AngleSlider.Range />
          </AngleSlider.Track>
          <AngleSlider.Thumb />
          <AngleSlider.ValueText />
        </AngleSlider.Control>
      </AngleSlider.Root>
      <Code>{`linear-gradient(${String(angle)}deg, …)`}</Code>
    </Stack>
  );
}
