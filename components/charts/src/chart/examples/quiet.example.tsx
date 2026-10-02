import { type ReactElement } from "react";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { useWords } from "@stealthscale/specimen";

import * as Chart from "#chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("chart");
  const chart = Chart.useChart({
    data: [],
    series: [{ key: "disputes", label: t("quiet.disputes") }],
  });

  return (
    <Chart.Root chart={chart}>
      <Chart.Plot>
        <BarChart accessibilityLayer data={chart.data} title={t("quiet.name")}>
          <XAxis dataKey="day" />
          <YAxis />
          <Bar dataKey="disputes" fill={chart.color("disputes")} isAnimationActive={false} />
        </BarChart>
      </Chart.Plot>
      <Chart.Empty>{t("quiet.empty")}</Chart.Empty>
      <Chart.Caption>{t("quiet.caption")}</Chart.Caption>
    </Chart.Root>
  );
}
