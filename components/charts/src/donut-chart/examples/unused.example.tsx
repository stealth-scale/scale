import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DonutChart } from "#donut-chart/index.ts";

export function Unused(): ReactElement {
  const { t } = useWords("donut-chart");

  return (
    <DonutChart
      caption={t("unused.caption")}
      empty={t("unused.empty")}
      label={t("usage.label")}
      slices={[]}
    />
  );
}
