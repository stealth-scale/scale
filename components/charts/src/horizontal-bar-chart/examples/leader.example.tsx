import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HorizontalBarChart } from "#horizontal-bar-chart/index.ts";

const COUNTRIES = [
  { country: "us", sessions: 48_200 },
  { country: "gb", sessions: 21_400 },
  { country: "de", sessions: 17_900 },
  { country: "nl", sessions: 12_300 },
  { country: "br", sessions: 9800 },
  { country: "in", sessions: 8600 },
];

export function Leader(): ReactElement {
  const { t } = useWords("horizontal-bar-chart");
  const rows = COUNTRIES.map(({ country, sessions }) => ({
    country: t(`countries.${country}`),
    sessions,
  }));

  return (
    <HorizontalBarChart
      caption={t("leader.caption")}
      categoryKey="country"
      data={rows}
      defaultIndex={0}
      label={t("countries.label")}
      series={[{ color: "indigo", key: "sessions", label: t("countries.sessions") }]}
      valueOptions={{ notation: "compact" }}
    />
  );
}
