import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadarChart } from "#radar-chart/index.ts";

import { COVERAGE } from "./scores.ts";

export function Coverage(): ReactElement {
  const { t } = useWords("radar-chart");
  const rows = COVERAGE.map(({ covered, module }) => ({ covered, module: t(`modules.${module}`) }));

  return (
    <RadarChart
      caption={t("coverage.caption")}
      categoryKey="module"
      data={rows}
      label={t("coverage.label")}
      scale
      series={[{ color: "green", key: "covered", label: t("coverage.covered") }]}
      valueDomain={[0, 100]}
      valueOptions={{ style: "unit", unit: "percent" }}
    />
  );
}
