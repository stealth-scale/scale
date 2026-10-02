import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ScatterPlot } from "#scatter-plot/index.ts";

const DEALS: Array<{ days: number; size: number }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("scatter-plot");

  return (
    <ScatterPlot
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("deals.label")}
      series={[{ key: "deals", label: t("quiet.deals"), points: DEALS }]}
      xKey="size"
      xLabel={t("deals.size")}
      yKey="days"
      yLabel={t("deals.days")}
    />
  );
}
