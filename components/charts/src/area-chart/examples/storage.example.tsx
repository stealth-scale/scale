import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { AreaChart } from "#area-chart/index.ts";

const MONTHS = [
  { month: "2026-04-01", used: 412 },
  { month: "2026-05-01", used: 468 },
  { month: "2026-06-01", used: 521 },
  { month: "2026-07-01", used: 604 },
  { month: "2026-08-01", used: 689 },
  { month: "2026-09-01", used: 742 },
];

export function Storage(): ReactElement {
  const { t } = useWords("area-chart");

  return (
    <AreaChart
      caption={t("storage.caption")}
      categoryKey="month"
      data={MONTHS}
      label={t("storage.label")}
      labelOptions={{ month: "short", timeZone: "UTC" }}
      series={[{ color: "teal", key: "used", label: t("storage.used") }]}
      valueOptions={{ style: "unit", unit: "gigabyte" }}
    />
  );
}
