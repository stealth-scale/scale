import { type ReactElement } from "react";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { useWords } from "@stealthscale/specimen";

import * as Chart from "#chart/index.ts";

const MONTHS = [
  { growth: 64, month: "2026-04-01", scale: 12, starter: 120 },
  { growth: 71, month: "2026-05-01", scale: 15, starter: 132 },
  { growth: 88, month: "2026-06-01", scale: 14, starter: 118 },
  { growth: 95, month: "2026-07-01", scale: 21, starter: 141 },
  { growth: 104, month: "2026-08-01", scale: 26, starter: 150 },
  { growth: 118, month: "2026-09-01", scale: 31, starter: 162 },
];

export function Signups(): ReactElement {
  const { t } = useWords("chart");
  const chart = Chart.useChart({
    data: MONTHS,
    series: [
      { color: "blue", key: "starter", label: t("signups.starter") },
      { color: "teal", key: "growth", label: t("signups.growth") },
      { color: "purple", key: "scale", label: t("signups.scale") },
    ],
  });
  const month = chart.formatDate({ month: "short", timeZone: "UTC" });

  return (
    <Chart.Root chart={chart}>
      <Chart.Plot>
        <BarChart accessibilityLayer data={chart.data} title={t("signups.name")}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickFormatter={month} />
          <YAxis allowDecimals={false} tickFormatter={chart.formatNumber()} width={48} />
          <Tooltip content={<Chart.Tooltip formatLabel={month} />} />
          {chart.series.map((series) => (
            <Bar
              dataKey={series.key}
              fill={series.color}
              hide={series.hidden}
              isAnimationActive={false}
              key={series.key}
              opacity={series.opacity}
              stackId="plan"
            />
          ))}
        </BarChart>
      </Chart.Plot>
      <Chart.Legend label={t("series")} />
      <Chart.Caption>{t("signups.caption")}</Chart.Caption>
    </Chart.Root>
  );
}
