import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BarChart } from "#bar-chart/index.ts";

const MONTHS: Array<{ growth: number; month: string; scale: number; starter: number }> = [];

export function Prelaunch(): ReactElement {
  const { t } = useWords("bar-chart");

  return (
    <BarChart
      caption={t("prelaunch.caption")}
      categoryKey="month"
      data={MONTHS}
      empty={t("prelaunch.empty")}
      label={t("signups.label")}
      series={[
        { key: "starter", label: t("signups.starter") },
        { key: "growth", label: t("signups.growth") },
        { key: "scale", label: t("signups.scale") },
      ]}
    />
  );
}
