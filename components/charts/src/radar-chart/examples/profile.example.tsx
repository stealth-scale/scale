import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadarChart } from "#radar-chart/index.ts";

import { SKILLS } from "./scores.ts";

export function Profile(): ReactElement {
  const { t } = useWords("radar-chart");
  const rows = SKILLS.map(({ level, skill }) => ({ level, skill: t(`skills.${skill}`) }));

  return (
    <RadarChart
      caption={t("profile.caption")}
      categoryKey="skill"
      data={rows}
      label={t("profile.label")}
      series={[{ color: "teal", key: "level", label: t("profile.team") }]}
      valueDomain={[0, 10]}
    />
  );
}
