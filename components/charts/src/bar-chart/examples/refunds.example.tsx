import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BarChart } from "#bar-chart/index.ts";

const DAYS = [
  { day: "2026-09-21", requests: 14 },
  { day: "2026-09-22", requests: 9 },
  { day: "2026-09-23", requests: 11 },
  { day: "2026-09-24", requests: 23 },
  { day: "2026-09-25", requests: 17 },
  { day: "2026-09-26", requests: 6 },
  { day: "2026-09-27", requests: 4 },
];

export function Refunds(): ReactElement {
  const { t } = useWords("bar-chart");

  return (
    <BarChart
      caption={t("refunds.caption")}
      categoryKey="day"
      data={DAYS}
      grid={false}
      label={t("refunds.label")}
      labelOptions={{ timeZone: "UTC", weekday: "short" }}
      series={[{ color: "orange", key: "requests", label: t("refunds.requests") }]}
    />
  );
}
