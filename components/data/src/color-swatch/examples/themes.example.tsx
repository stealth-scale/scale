import { type ReactElement } from "react";

import { Grid } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";

import { ColorSwatchMix } from "#color-swatch/index.ts";

const THEMES = [
  ["cinder", ["#303841", "#3A4750", "#D72323", "#EEEEEE"]],
  ["harbour", ["#1B3C53", "#234C6A", "#456882", "#E3E3E3"]],
  ["admiral", ["#0C2B4E", "#1A3D64", "#1D546C", "#F4F4F4"]],
  ["regatta", ["#BF092F", "#132440", "#16476A", "#3B9797"]],
  ["pine", ["#092328", "#12544F", "#2A835F", "#8BBB92"]],
  ["carnival", ["#2D4059", "#EA5455", "#F07B3F", "#FFD460"]],
  ["dusk", ["#F67280", "#C06C84", "#6C5B7B", "#355C7D"]],
  ["neon", ["#450693", "#8C00FF", "#FF3F7F", "#FFC400"]],
  ["blush", ["#021A54", "#FF85BB", "#FFCEE3", "#F5F5F5"]],
] as const;

export function Themes(): ReactElement {
  return (
    <Grid.Root columns="3" gap="md">
      {THEMES.map(([name, colors]) => (
        <Text key={name}>
          <ColorSwatchMix items={colors} shape="circle" size="lg" /> {name}
        </Text>
      ))}
    </Grid.Root>
  );
}
