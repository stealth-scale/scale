import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RangeChart } from "#range-chart/index.ts";

const WEEKS: Array<{ forecast: number; high: number; low: number; week: string }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("range-chart");

  return (
    <RangeChart
      band={{ high: "high", key: "interval", label: t("forecast.interval"), low: "low" }}
      caption={t("quiet.caption")}
      categoryKey="week"
      data={WEEKS}
      empty={t("quiet.empty")}
      label={t("forecast.label")}
      legendLabel={t("series")}
      series={[{ dashed: true, key: "forecast", label: t("forecast.forecast") }]}
    />
  );
}
