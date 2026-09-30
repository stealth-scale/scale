import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadarChart } from "#radar-chart/index.ts";

import { TEAMS } from "./scores.ts";

export function Teams(): ReactElement {
  const { t } = useWords("radar-chart");
  const rows = TEAMS.map(({ dimension, identity, payments, search }) => ({
    dimension: t(`dimensions.${dimension}`),
    identity,
    payments,
    search,
  }));

  return (
    <RadarChart
      caption={t("teams.caption")}
      categoryKey="dimension"
      data={rows}
      label={t("teams.label")}
      series={[
        { filled: false, key: "payments", label: t("teams.payments") },
        { filled: false, key: "search", label: t("teams.search") },
        { filled: false, key: "identity", label: t("teams.identity") },
      ]}
      valueDomain={[0, 10]}
    />
  );
}
