import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";

import { ColorSwatch } from "#color-swatch/index.ts";

export function Translucent(): ReactElement {
  return (
    <Stack direction="row" gap="sm">
      <ColorSwatch size="2xl" value="#D72323" />
      <ColorSwatch size="2xl" value="rgb(215 35 35 / 40%)" />
    </Stack>
  );
}
