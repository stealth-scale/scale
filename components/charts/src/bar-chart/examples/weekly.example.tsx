import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BarChart } from "#bar-chart/index.ts";

const WEEKS = [212, 238, 225, 251, 262, 244, 270, 288, 281, 305, 319, 334].map(
  (signups, index) => ({
    signups,
    week: new Date(Date.UTC(2026, 6, 6 + index * 7)).toISOString().slice(0, 10),
  }),
);

export function Weekly(): ReactElement {
  const { t } = useWords("bar-chart");

  return (
    <BarChart
      caption={t("weekly.caption")}
      categoryKey="week"
      data={WEEKS}
      label={t("weekly.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      ratio="wide"
      series={[{ key: "signups", label: t("weekly.signups") }]}
    />
  );
}
