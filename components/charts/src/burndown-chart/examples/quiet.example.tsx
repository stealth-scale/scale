import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BurndownChart } from "#burndown-chart/index.ts";

const POINTS: Array<{ at: string; remaining?: number }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("burndown-chart");

  return (
    <BurndownChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      idealLabel={t("ideal")}
      label={t("sprint.label")}
      legendLabel={t("series")}
      points={POINTS}
      projectedLabel={t("projected")}
      remainingLabel={t("remaining")}
    />
  );
}
