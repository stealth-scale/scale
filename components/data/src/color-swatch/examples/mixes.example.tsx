import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";

import { ColorSwatchMix } from "#color-swatch/index.ts";

export function Mixes(): ReactElement {
  return (
    <Stack direction="row" gap="md">
      <ColorSwatchMix items={["#303841", "#D72323"]} size="xl" />
      <ColorSwatchMix items={["#303841", "#3A4750", "#D72323"]} size="xl" />
      <ColorSwatchMix items={["#303841", "#3A4750", "#D72323", "#EEEEEE"]} size="xl" />
    </Stack>
  );
}
