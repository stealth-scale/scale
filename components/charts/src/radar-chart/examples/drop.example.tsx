import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadarChart } from "#radar-chart/index.ts";

import { SCORECARD } from "./scores.ts";

export function Drop(): ReactElement {
  const { t } = useWords("radar-chart");
  const rows = SCORECARD.map(({ current, dimension, previous }) => ({
    current,
    dimension: t(`dimensions.${dimension}`),
    previous,
  }));

  return (
    <RadarChart
      caption={t("drop.caption")}
      categoryKey="dimension"
      data={rows}
      defaultIndex={2}
      label={t("scorecard.label")}
      series={[
        { key: "current", label: t("current") },
        { key: "previous", label: t("previous") },
      ]}
      valueDomain={[0, 10]}
    />
  );
}
