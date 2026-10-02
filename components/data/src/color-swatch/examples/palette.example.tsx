import { type ReactElement } from "react";

import { Group } from "@stealthscale/component-layout";

import { ColorSwatch } from "#color-swatch/index.ts";

const CINDER = ["#303841", "#3A4750", "#D72323", "#EEEEEE"];

export function Palette(): ReactElement {
  return (
    <Group attached>
      {CINDER.map((value) => (
        <ColorSwatch key={value} shape="square" size="3xl" value={value} />
      ))}
    </Group>
  );
}
