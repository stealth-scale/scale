import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BubbleChart } from "#bubble-chart/index.ts";

const BUSINESS = [
  [240, 0.66, 216_000],
  [200, 0.43, 180_000],
  [150, 0.71, 135_000],
  [120, 0.47, 108_000],
  [85, 0.62, 76_500],
  [60, 0.54, 54_000],
].map(([seats = 0, active = 0, arr = 0]) => ({ active, arr, seats }));

const TEAM = [
  [30, 0.69, 18_000],
  [25, 0.77, 15_000],
  [20, 0.58, 12_000],
  [15, 0.81, 9000],
  [12, 0.65, 7200],
  [8, 0.72, 4800],
].map(([seats = 0, active = 0, arr = 0]) => ({ active, arr, seats }));

export function Largest(): ReactElement {
  const { t } = useWords("bubble-chart");

  return (
    <BubbleChart
      caption={t("largest.caption")}
      defaultIndex={0}
      label={t("accounts.label")}
      legendLabel={t("plans")}
      series={[
        { key: "business", label: t("accounts.business"), points: BUSINESS },
        { key: "team", label: t("accounts.team"), points: TEAM },
      ]}
      sizeKey="arr"
      sizeLabel={t("accounts.arr")}
      sizeOptions={{ currency: "EUR", notation: "compact", style: "currency" }}
      xKey="seats"
      xLabel={t("accounts.seats")}
      yKey="active"
      yLabel={t("accounts.active")}
      yOptions={{ style: "percent" }}
    />
  );
}
