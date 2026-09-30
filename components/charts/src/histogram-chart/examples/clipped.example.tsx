import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HistogramChart } from "#histogram-chart/index.ts";

import { LATENCIES } from "./latencies.ts";

export function Clipped(): ReactElement {
  const { t } = useWords("histogram-chart");

  return (
    <HistogramChart
      caption={t("clipped.caption")}
      countLabel={t("requests")}
      domain={[0, 150]}
      label={t("latency.label")}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
      values={LATENCIES}
    />
  );
}
