import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ParetoChart, paretoCutoff, paretoRows } from "#pareto-chart/index.ts";

const REASONS = [
  { reason: "Export", tickets: 98 },
  { reason: "Login", tickets: 412 },
  { reason: "Search", tickets: 51 },
  { reason: "Billing", tickets: 356 },
  { reason: "Mobile", tickets: 37 },
  { reason: "Invites", tickets: 64 },
  { reason: "Reports", tickets: 22 },
  { reason: "Webhooks", tickets: 43 },
  { reason: "Other", tickets: 17 },
];

export function Tickets(): ReactElement {
  const { t } = useWords("pareto-chart");
  const cutoff = paretoCutoff(paretoRows(REASONS, "tickets"));

  return (
    <ParetoChart
      caption={t("tickets.caption", { count: cutoff, total: REASONS.length })}
      categoryKey="reason"
      cumulativeLabel={t("cumulative")}
      data={REASONS}
      label={t("tickets.label")}
      legendLabel={t("series")}
      valueKey="tickets"
      valueLabel={t("tickets.tickets")}
    />
  );
}
