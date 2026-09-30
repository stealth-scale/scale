import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadarChart } from "#radar-chart/index.ts";

import { type ScorecardRow } from "./scores.ts";

const NONE: ScorecardRow[] = [];

export function Quiet(): ReactElement {
  const { t } = useWords("radar-chart");

  return (
    <RadarChart
      caption={t("quiet.caption")}
      categoryKey="dimension"
      data={NONE}
      empty={t("quiet.empty")}
      label={t("scorecard.label")}
      series={[
        { key: "current", label: t("current") },
        { key: "previous", label: t("previous") },
      ]}
      valueDomain={[0, 10]}
    />
  );
}
