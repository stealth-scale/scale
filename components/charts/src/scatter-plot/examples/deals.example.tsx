import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ScatterPlot } from "#scatter-plot/index.ts";

const MID_MARKET = [
  [12, 28],
  [18, 22],
  [25, 41],
  [9, 19],
  [30, 38],
  [15, 33],
  [22, 26],
  [27, 49],
  [11, 15],
  [19, 37],
  [33, 44],
  [24, 31],
].map(([size = 0, days = 0]) => ({ days, size: size * 1000 }));

const ENTERPRISE = [
  [85, 120],
  [120, 104],
  [64, 97],
  [150, 178],
  [98, 141],
  [110, 96],
  [72, 131],
  [135, 156],
  [160, 149],
  [90, 88],
].map(([size = 0, days = 0]) => ({ days, size: size * 1000 }));

export function Deals(): ReactElement {
  const { t } = useWords("scatter-plot");

  return (
    <ScatterPlot
      caption={t("deals.caption")}
      label={t("deals.label")}
      legendLabel={t("segments")}
      series={[
        { key: "mid", label: t("deals.mid"), points: MID_MARKET },
        { key: "enterprise", label: t("deals.enterprise"), points: ENTERPRISE },
      ]}
      xKey="size"
      xLabel={t("deals.size")}
      xOptions={{ currency: "EUR", notation: "compact", style: "currency" }}
      yKey="days"
      yLabel={t("deals.days")}
    />
  );
}
