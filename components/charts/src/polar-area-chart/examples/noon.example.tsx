import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

import { HOURS } from "./cycles.ts";

export function Noon(): ReactElement {
  const { t } = useWords("polar-area-chart");

  return (
    <PolarAreaChart
      caption={t("noon.caption")}
      defaultIndex={4}
      label={t("requests.label")}
      slices={HOURS.map(({ key, value }) => ({ key, label: t(`hours.${key}`), value }))}
    />
  );
}
