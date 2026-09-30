import { type ReactElement } from "react";

import { Grid } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { GaugeChart } from "#gauge-chart/index.ts";

import { HOST, USE } from "./readings.ts";

export function Tiles(): ReactElement {
  const { t } = useWords("gauge-chart");

  return (
    <Grid.Root columns="3">
      {HOST.map(({ key, used }) => (
        <GaugeChart
          caption={t(`tiles.${key}`)}
          key={key}
          label={t(`tiles.${key}`)}
          limits={false}
          max={1}
          value={used}
          valueOptions={{ style: "percent" }}
          zones={USE.map((zone) => ({
            color: zone.color,
            label: t(`zones.${zone.key}`),
            upTo: zone.upTo,
          }))}
        />
      ))}
    </Grid.Root>
  );
}
