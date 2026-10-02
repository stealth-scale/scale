import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StackedBarChart } from "#stacked-bar-chart/index.ts";

const MONTHS = [
  [2400, 6400, 9600],
  [2600, 7100, 12_000],
  [2400, 8800, 11_200],
  [2800, 9500, 16_800],
  [3000, 13_400, 20_800],
  [3000, 15_800, 24_800],
].map(([starter, growth, scale], index) => ({
  growth,
  month: `2026-0${String(4 + index)}-01`,
  scale,
  starter,
}));

export function Revenue(): ReactElement {
  const { t } = useWords("stacked-bar-chart");

  return (
    <StackedBarChart
      caption={t("revenue.caption")}
      categoryKey="month"
      data={MONTHS}
      label={t("revenue.label")}
      labelOptions={{ month: "short", timeZone: "UTC" }}
      legendLabel={t("series")}
      series={[
        { key: "scale", label: t("revenue.scale") },
        { key: "growth", label: t("revenue.growth") },
        { key: "starter", label: t("revenue.starter") },
      ]}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
