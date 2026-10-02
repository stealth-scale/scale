import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RangeChart } from "#range-chart/index.ts";

const WEEKS = [
  { actual: 12_400, week: "2026-07-06" },
  { actual: 12_900, week: "2026-07-13" },
  { actual: 13_100, week: "2026-07-20" },
  { actual: 13_800, week: "2026-07-27" },
  { actual: 14_200, week: "2026-08-03" },
  { actual: 14_100, week: "2026-08-10" },
  { actual: 14_700, week: "2026-08-17" },
  { actual: 15_100, forecast: 15_100, high: 15_100, low: 15_100, week: "2026-08-24" },
  { forecast: 15_500, high: 16_100, low: 14_900, week: "2026-08-31" },
  { forecast: 15_900, high: 16_800, low: 15_000, week: "2026-09-07" },
  { forecast: 16_300, high: 17_400, low: 15_200, week: "2026-09-14" },
  { forecast: 16_700, high: 18_100, low: 15_300, week: "2026-09-21" },
  { forecast: 17_100, high: 18_800, low: 15_400, week: "2026-09-28" },
  { forecast: 17_500, high: 19_500, low: 15_500, week: "2026-10-05" },
];

export function Horizon(): ReactElement {
  const { t } = useWords("range-chart");

  return (
    <RangeChart
      band={{ high: "high", key: "interval", label: t("forecast.interval"), low: "low" }}
      caption={t("horizon.caption")}
      categoryKey="week"
      data={WEEKS}
      defaultIndex={13}
      label={t("forecast.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      legendLabel={t("series")}
      series={[
        { key: "actual", label: t("forecast.actual") },
        { dashed: true, key: "forecast", label: t("forecast.forecast") },
      ]}
      valueDomain={[10_000, 20_000]}
    />
  );
}
