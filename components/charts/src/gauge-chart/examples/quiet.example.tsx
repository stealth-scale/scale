import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { GaugeChart } from "#gauge-chart/index.ts";

import { BUDGET_MAX } from "./readings.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("gauge-chart");

  return (
    <GaugeChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("latency.label")}
      max={BUDGET_MAX}
      value={Number.NaN}
    />
  );
}
