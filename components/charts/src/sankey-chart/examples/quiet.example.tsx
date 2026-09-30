import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SankeyChart } from "#sankey-chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("sankey-chart");

  return (
    <SankeyChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      flows={[]}
      label={t("visitors.label")}
      nodes={[]}
    />
  );
}
