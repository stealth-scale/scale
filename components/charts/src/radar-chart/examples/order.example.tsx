import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadarChart } from "#radar-chart/index.ts";

import { SWAPPED } from "./scores.ts";

export function Order(): ReactElement {
  const { t } = useWords("radar-chart");
  const rows = SWAPPED.map(({ current, dimension, previous }) => ({
    current,
    dimension: t(`dimensions.${dimension}`),
    previous,
  }));

  return (
    <RadarChart
      caption={t("order.caption")}
      categoryKey="dimension"
      data={rows}
      label={t("scorecard.label")}
      series={[
        { key: "current", label: t("current") },
        { key: "previous", label: t("previous") },
      ]}
      valueDomain={[0, 10]}
    />
  );
}
