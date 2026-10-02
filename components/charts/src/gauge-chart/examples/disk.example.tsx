import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { GaugeChart } from "#gauge-chart/index.ts";

import { USE } from "./readings.ts";

export function Disk(): ReactElement {
  const { t } = useWords("gauge-chart");

  return (
    <GaugeChart
      caption={t("disk.caption")}
      label={t("disk.label")}
      max={1}
      value={0.86}
      valueOptions={{ style: "percent" }}
      zones={USE.map(({ color, key, upTo }) => ({ color, label: t(`zones.${key}`), upTo }))}
    />
  );
}
