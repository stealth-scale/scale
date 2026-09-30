import { type ReactElement } from "react";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { useWords } from "@stealthscale/specimen";

import * as Chart from "#chart/index.ts";

const HOURS = [180, 190, 210, 260, 340, 390, 310, 240, 205, 195, 188, 182].map((p95, index) => ({
  hour: `2026-09-28T${String(index + 8).padStart(2, "0")}:00:00Z`,
  p95,
  target: 300,
}));

export function Latency(): ReactElement {
  const { t } = useWords("chart");
  const chart = Chart.useChart({
    data: HOURS,
    series: [
      { key: "p95", label: t("latency.p95") },
      { color: "error", key: "target", label: t("latency.target") },
    ],
  });
  const time = chart.formatDate({
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone: "UTC",
  });
  const ms = chart.formatNumber({ style: "unit", unit: "millisecond", unitDisplay: "narrow" });

  return (
    <Chart.Root chart={chart} ratio="wide">
      <Chart.Plot>
        <LineChart accessibilityLayer data={chart.data} title={t("latency.name")}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickFormatter={time} />
          <YAxis tickFormatter={ms} width={64} />
          <Tooltip content={<Chart.Tooltip formatLabel={time} formatValue={ms} />} />
          <Line
            dataKey="p95"
            dot={false}
            hide={chart.hidden("p95")}
            isAnimationActive={false}
            opacity={chart.opacity("p95")}
            stroke={chart.color("p95")}
            strokeWidth={2}
            type="monotone"
          />
          <Line
            dataKey="target"
            dot={false}
            hide={chart.hidden("target")}
            isAnimationActive={false}
            opacity={chart.opacity("target")}
            stroke={chart.color("target")}
            strokeDasharray="6 4"
            strokeWidth={2}
          />
        </LineChart>
      </Chart.Plot>
      <Chart.Legend label={t("series")} />
      <Chart.Caption>{t("latency.caption")}</Chart.Caption>
    </Chart.Root>
  );
}
