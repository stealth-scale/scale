import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HistogramChart } from "#histogram-chart/index.ts";

import { LATENCIES } from "./latencies.ts";

export function Latency(): ReactElement {
  const { t } = useWords("histogram-chart");

  return (
    <HistogramChart
      caption={t("latency.caption")}
      countLabel={t("requests")}
      label={t("latency.label")}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
      values={LATENCIES}
    />
  );
}
