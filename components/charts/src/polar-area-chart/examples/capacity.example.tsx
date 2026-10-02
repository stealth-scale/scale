import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

import { CAPACITY, HOURS } from "./cycles.ts";

export function Capacity(): ReactElement {
  const { t } = useWords("polar-area-chart");

  return (
    <PolarAreaChart
      caption={t("capacity.caption")}
      label={t("requests.label")}
      max={CAPACITY}
      slices={HOURS.map(({ key, value }) => ({ key, label: t(`hours.${key}`), value }))}
    />
  );
}
