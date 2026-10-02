import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HorizontalBarChart } from "#horizontal-bar-chart/index.ts";

const TEAMS = [
  { done: 0.92, plan: 1, team: "atlas" },
  { done: 0.64, plan: 1, team: "borealis" },
  { done: 1.08, plan: 1, team: "cygnus" },
  { done: 0.81, plan: 0.9, team: "draco" },
  { done: 0.97, plan: 1.1, team: "eridanus" },
  { done: 1.12, plan: 1, team: "fornax" },
];

export function Bullet(): ReactElement {
  const { t } = useWords("horizontal-bar-chart");
  const rows = TEAMS.map(({ done, plan, team }) => ({ done, plan, team: t(`bullet.${team}`) }));

  return (
    <HorizontalBarChart
      caption={t("bullet.caption")}
      categoryKey="team"
      data={rows}
      label={t("bullet.label")}
      series={[{ key: "done", label: t("bullet.done"), target: "plan" }]}
      targetLabel={t("bullet.target")}
      valueDomain={[0, 1.2]}
      valueOptions={{ style: "percent" }}
      zones={[
        { color: "error", label: t("bullet.behind"), upTo: 0.7 },
        { color: "warning", label: t("bullet.close"), upTo: 0.9 },
        { color: "success", label: t("bullet.on"), upTo: 1.2 },
      ]}
    />
  );
}
