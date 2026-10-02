import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { AreaChart } from "#area-chart/index.ts";

const HOURS = [
  [120, 40, 35],
  [180, 55, 42],
  [260, 90, 51],
  [310, 140, 48],
  [295, 180, 57],
  [240, 150, 44],
  [205, 95, 39],
  [150, 60, 36],
].map(([inbound, outbound, replication], index) => ({
  hour: `2026-09-28T${String(index * 3).padStart(2, "0")}:00:00Z`,
  inbound,
  outbound,
  replication,
}));

export function Internal(): ReactElement {
  const { t } = useWords("area-chart");

  return (
    <AreaChart
      caption={t("internal.caption")}
      categoryKey="hour"
      curve="linear"
      data={HOURS}
      defaultHiddenKeys={["replication"]}
      label={t("bandwidth.label")}
      labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
      legendLabel={t("series")}
      series={[
        { key: "inbound", label: t("bandwidth.inbound") },
        { key: "outbound", label: t("bandwidth.outbound") },
        { key: "replication", label: t("internal.replication") },
      ]}
      valueOptions={{ style: "unit", unit: "megabit-per-second", unitDisplay: "short" }}
    />
  );
}
