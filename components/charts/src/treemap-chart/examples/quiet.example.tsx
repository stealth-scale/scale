import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { TreemapChart } from "#treemap-chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("treemap-chart");

  return (
    <TreemapChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("spend.label")}
      nodes={[]}
    />
  );
}
