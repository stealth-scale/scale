import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BurndownChart } from "#burndown-chart/index.ts";

const POINTS = [
  { at: "2026-09-14", remaining: 30 },
  { at: "2026-09-15", remaining: 28 },
  { at: "2026-09-16", remaining: 36 },
  { at: "2026-09-17", remaining: 35 },
  { at: "2026-09-18" },
  { at: "2026-09-21" },
  { at: "2026-09-22" },
  { at: "2026-09-23" },
  { at: "2026-09-24" },
  { at: "2026-09-25" },
];

export function Scope(): ReactElement {
  const { t } = useWords("burndown-chart");

  return (
    <BurndownChart
      caption={t("scope.caption")}
      idealLabel={t("ideal")}
      label={t("scope.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      legendLabel={t("series")}
      points={POINTS}
      projectedLabel={t("projected")}
      remainingLabel={t("remaining")}
    />
  );
}
