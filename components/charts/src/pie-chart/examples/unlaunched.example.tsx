import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PieChart } from "#pie-chart/index.ts";

export function Unlaunched(): ReactElement {
  const { t } = useWords("pie-chart");

  return (
    <PieChart
      caption={t("unlaunched.caption")}
      empty={t("unlaunched.empty")}
      label={t("plans.label")}
      slices={[]}
    />
  );
}
