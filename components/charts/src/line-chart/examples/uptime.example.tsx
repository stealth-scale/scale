import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const DAYS = [
  0.9998, 0.9999, 0.9995, 1, 0.9997, 0.9999, 0.9994, 0.9998, 0.9999, 0.9971, 0.9992, 0.9998, 1,
  0.9999,
].map((availability, index) => ({
  availability,
  day: `2026-09-${String(index + 15)}`,
}));

export function Uptime(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      caption={t("uptime.caption")}
      categoryKey="day"
      curve="linear"
      data={DAYS}
      label={t("uptime.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      series={[{ color: "success", key: "availability", label: t("uptime.availability") }]}
      valueDomain={[0.99, 1]}
      valueOptions={{ maximumFractionDigits: 2, style: "percent" }}
    />
  );
}
