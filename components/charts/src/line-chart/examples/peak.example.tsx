import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const HOURS = [
  [92, 180],
  [95, 190],
  [101, 210],
  [118, 260],
  [142, 340],
  [155, 390],
  [131, 310],
  [112, 240],
  [104, 205],
  [99, 195],
].map(([p50, p95], index) => ({
  hour: `2026-09-28T${String(index + 8).padStart(2, "0")}:00:00Z`,
  p50,
  p95,
}));

export function Peak(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      caption={t("peak.caption")}
      categoryKey="hour"
      data={HOURS}
      defaultIndex={5}
      label={t("latency.label")}
      labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
      legendLabel={t("series")}
      series={[
        { key: "p50", label: t("latency.p50") },
        { key: "p95", label: t("latency.p95") },
      ]}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
    />
  );
}
