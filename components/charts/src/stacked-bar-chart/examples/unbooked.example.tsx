import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StackedBarChart } from "#stacked-bar-chart/index.ts";

const MONTHS: Array<{ growth: number; month: string; scale: number; starter: number }> = [];

export function Unbooked(): ReactElement {
  const { t } = useWords("stacked-bar-chart");

  return (
    <StackedBarChart
      caption={t("unbooked.caption")}
      categoryKey="month"
      data={MONTHS}
      empty={t("unbooked.empty")}
      label={t("revenue.label")}
      series={[
        { key: "scale", label: t("revenue.scale") },
        { key: "growth", label: t("revenue.growth") },
        { key: "starter", label: t("revenue.starter") },
      ]}
    />
  );
}
