import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BurndownChart } from "#burndown-chart/index.ts";

const POINTS = [
  { at: "2026-09-14", remaining: 60 },
  { at: "2026-09-15", remaining: 55 },
  { at: "2026-09-16", remaining: 52 },
  { at: "2026-09-17", remaining: 47 },
  { at: "2026-09-18", remaining: 44 },
  { at: "2026-09-21", remaining: 39 },
  { at: "2026-09-22", remaining: 36 },
  { at: "2026-09-23" },
  { at: "2026-09-24" },
  { at: "2026-09-25" },
];

export function Today(): ReactElement {
  const { t } = useWords("burndown-chart");

  return (
    <BurndownChart
      caption={t("today.caption")}
      defaultIndex={6}
      idealLabel={t("ideal")}
      label={t("sprint.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      legendLabel={t("series")}
      points={POINTS}
      projectedLabel={t("projected")}
      remainingLabel={t("remaining")}
    />
  );
}
