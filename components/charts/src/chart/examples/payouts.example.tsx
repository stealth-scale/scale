import { type ReactElement } from "react";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { useWords } from "@stealthscale/specimen";

import * as Chart from "#chart/index.ts";

const DAYS = [
  { day: "2026-09-21", paid: 4200, refunded: 310 },
  { day: "2026-09-22", paid: 5100, refunded: 280 },
  { day: "2026-09-23", paid: 4800, refunded: 910 },
  { day: "2026-09-24", paid: 6100, refunded: 1250 },
  { day: "2026-09-25", paid: 5900, refunded: 1120 },
  { day: "2026-09-26", paid: 3900, refunded: 420 },
  { day: "2026-09-27", paid: 3500, refunded: 380 },
];

export function Payouts(props: Omit<Chart.RootProps, "chart">): ReactElement {
  const { t } = useWords("chart");
  const chart = Chart.useChart({
    data: DAYS,
    series: [
      { key: "paid", label: t("payouts.paid") },
      { key: "refunded", label: t("payouts.refunded") },
    ],
  });
  const euros = chart.formatNumber({
    currency: "EUR",
    maximumFractionDigits: 0,
    style: "currency",
  });
  const weekday = chart.formatDate({ timeZone: "UTC", weekday: "short" });

  return (
    <Chart.Root chart={chart} {...props}>
      <Chart.Plot>
        <LineChart accessibilityLayer data={chart.data} title={t("payouts.name")}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickFormatter={weekday} />
          <YAxis tickFormatter={euros} width={72} />
          <Tooltip content={<Chart.Tooltip formatLabel={weekday} formatValue={euros} />} />
          {chart.series.map((series) => (
            <Line
              dataKey={series.key}
              dot={false}
              hide={series.hidden}
              isAnimationActive={false}
              key={series.key}
              opacity={series.opacity}
              stroke={series.color}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </LineChart>
      </Chart.Plot>
      <Chart.Legend label={t("series")} />
      <Chart.Caption>{t("payouts.caption")}</Chart.Caption>
    </Chart.Root>
  );
}
