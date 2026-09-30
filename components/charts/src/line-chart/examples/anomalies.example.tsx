import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const DAYS = [
  1180, 1215, 1240, 1198, 312, 1170, 1225, 1260, 1244, 1290, 1410, 1265, 1250, 1238,
].map((orders, index) => ({ day: `2026-09-${String(index + 14)}`, orders }));

export function Anomalies(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      annotations={[
        {
          at: "2026-09-18",
          color: "error",
          key: "outage",
          label: t("anomalies.outage"),
          value: 312,
        },
        {
          at: "2026-09-24",
          color: "warning",
          key: "duplicates",
          label: t("anomalies.duplicates"),
          value: 1410,
        },
      ]}
      caption={t("anomalies.caption")}
      categoryKey="day"
      curve="linear"
      data={DAYS}
      label={t("anomalies.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      series={[{ key: "orders", label: t("anomalies.orders") }]}
    />
  );
}
