import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { GaugeChart } from "#gauge-chart/index.ts";

import { BUDGET_MAX, LATENCY } from "./readings.ts";

export function Latency(): ReactElement {
  const { t } = useWords("gauge-chart");

  return (
    <GaugeChart
      caption={t("latency.caption")}
      label={t("latency.label")}
      max={BUDGET_MAX}
      value={740}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
      zones={LATENCY.map(({ color, key, upTo }) => ({ color, label: t(`zones.${key}`), upTo }))}
    />
  );
}
