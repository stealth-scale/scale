import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HorizontalBarChart } from "#horizontal-bar-chart/index.ts";

const COUNTRIES: Array<{ country: string; sessions: number }> = [];

export function Unvisited(): ReactElement {
  const { t } = useWords("horizontal-bar-chart");

  return (
    <HorizontalBarChart
      caption={t("unvisited.caption")}
      categoryKey="country"
      data={COUNTRIES}
      empty={t("unvisited.empty")}
      label={t("countries.label")}
      series={[{ color: "indigo", key: "sessions", label: t("countries.sessions") }]}
    />
  );
}
