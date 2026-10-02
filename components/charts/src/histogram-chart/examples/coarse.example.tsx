import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HistogramChart } from "#histogram-chart/index.ts";

import { LATENCIES } from "./latencies.ts";

export function Coarse(): ReactElement {
  const { t } = useWords("histogram-chart");

  return (
    <HistogramChart
      bins={6}
      caption={t("coarse.caption")}
      countLabel={t("requests")}
      label={t("latency.label")}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
      values={LATENCIES}
    />
  );
}
