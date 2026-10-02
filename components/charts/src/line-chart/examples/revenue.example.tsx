import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const DAYS = [
  { day: "2026-09-21", revenue: 18_200 },
  { day: "2026-09-22", revenue: 21_400 },
  { day: "2026-09-23", revenue: 20_100 },
  { day: "2026-09-24", revenue: 24_800 },
  { day: "2026-09-25", revenue: 26_300 },
  { day: "2026-09-26", revenue: 15_900 },
  { day: "2026-09-27", revenue: 14_700 },
];

export function Revenue(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      caption={t("revenue.caption")}
      categoryKey="day"
      data={DAYS}
      label={t("revenue.label")}
      labelOptions={{ timeZone: "UTC", weekday: "short" }}
      series={[{ key: "revenue", label: t("revenue.revenue") }]}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
