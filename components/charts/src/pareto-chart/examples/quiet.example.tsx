import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ParetoChart } from "#pareto-chart/index.ts";

const REASONS: Array<{ reason: string; tickets: number }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("pareto-chart");

  return (
    <ParetoChart
      caption={t("quiet.caption")}
      categoryKey="reason"
      cumulativeLabel={t("cumulative")}
      data={REASONS}
      empty={t("quiet.empty")}
      label={t("tickets.label")}
      legendLabel={t("series")}
      valueKey="tickets"
      valueLabel={t("tickets.tickets")}
    />
  );
}
