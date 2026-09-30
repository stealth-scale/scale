import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { TreemapChart } from "#treemap-chart/index.ts";

import { labelled, TAIL } from "./spend.ts";

export function Tail(): ReactElement {
  const { t } = useWords("treemap-chart");

  return (
    <TreemapChart
      caption={t("tail.caption")}
      label={t("tail.label")}
      legendLabel={t("teams")}
      nodes={labelled(TAIL, (key) => t(`names.${key}`))}
      shareLabel={t("tail.share")}
      valueLabel={t("value")}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
