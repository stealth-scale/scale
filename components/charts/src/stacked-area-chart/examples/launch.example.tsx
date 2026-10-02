import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StackedAreaChart } from "#stacked-area-chart/index.ts";

const DAYS = [
  [4200, 2600, 900],
  [4600, 2900, 1100],
  [4400, 3100, 1400],
  [5100, 3300, 2600],
  [5300, 3600, 2100],
  [3100, 2200, 800],
  [2900, 2000, 700],
].map(([direct, search, referral], index) => ({
  day: `2026-09-${String(21 + index)}`,
  direct,
  referral,
  search,
}));

export function Launch(): ReactElement {
  const { t } = useWords("stacked-area-chart");

  return (
    <StackedAreaChart
      caption={t("launch.caption")}
      categoryKey="day"
      data={DAYS}
      defaultIndex={3}
      label={t("traffic.label")}
      labelOptions={{ timeZone: "UTC", weekday: "short" }}
      legendLabel={t("series")}
      series={[
        { key: "direct", label: t("traffic.direct") },
        { key: "search", label: t("traffic.search") },
        { key: "referral", label: t("traffic.referral") },
      ]}
      valueOptions={{ notation: "compact" }}
    />
  );
}
