import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PieChart } from "#pie-chart/index.ts";

export function Largest(): ReactElement {
  const { t } = useWords("pie-chart");

  return (
    <PieChart
      caption={t("largest.caption")}
      defaultIndex={0}
      label={t("plans.label")}
      legendLabel={t("plans.legend")}
      slices={[
        { key: "starter", label: t("plans.starter"), value: 610 },
        { key: "growth", label: t("plans.growth"), value: 520 },
        { key: "scale", label: t("plans.scale"), value: 170 },
      ]}
    />
  );
}
