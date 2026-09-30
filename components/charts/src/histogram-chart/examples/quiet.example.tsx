import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HistogramChart } from "#histogram-chart/index.ts";

const LATENCIES: number[] = [];

export function Quiet(): ReactElement {
  const { t } = useWords("histogram-chart");

  return (
    <HistogramChart
      caption={t("quiet.caption")}
      countLabel={t("requests")}
      empty={t("quiet.empty")}
      label={t("latency.label")}
      values={LATENCIES}
    />
  );
}
