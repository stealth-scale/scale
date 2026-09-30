import { type ReactElement } from "react";

import { Pie, PieChart, Tooltip } from "recharts";

import { useWords } from "@stealthscale/specimen";

import * as Chart from "#chart/index.ts";

const KINDS = [
  { gigabytes: 118, kind: "video" },
  { gigabytes: 42, kind: "images" },
  { gigabytes: 26, kind: "archives" },
  { gigabytes: 9.5, kind: "documents" },
];

export function Storage(): ReactElement {
  const { t } = useWords("chart");
  const chart = Chart.useChart({
    data: KINDS,
    series: [
      { key: "video", label: t("storage.video") },
      { key: "images", label: t("storage.images") },
      { key: "archives", label: t("storage.archives") },
      { key: "documents", label: t("storage.documents") },
    ],
  });
  const size = chart.formatNumber({ maximumFractionDigits: 1, style: "unit", unit: "gigabyte" });
  const sectors = chart.data
    .filter((row) => !chart.hidden(row.kind))
    .map(({ gigabytes, kind }) => ({ fill: chart.color(kind), gigabytes, kind }));

  return (
    <Chart.Root chart={chart} ratio="landscape">
      <Chart.Plot>
        <PieChart accessibilityLayer title={t("storage.name")}>
          <Tooltip content={<Chart.Tooltip formatValue={size} />} />
          <Pie
            data={sectors}
            dataKey="gigabytes"
            innerRadius="60%"
            isAnimationActive={false}
            nameKey="kind"
            outerRadius="90%"
            paddingAngle={1}
            rootTabIndex={-1}
          />
        </PieChart>
      </Chart.Plot>
      <Chart.Legend label={t("storage.legend")} />
      <Chart.Caption>{t("storage.caption")}</Chart.Caption>
    </Chart.Root>
  );
}
