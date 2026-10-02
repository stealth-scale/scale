import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SunburstChart } from "#sunburst-chart/index.ts";

import { labelled, SPEND } from "./spend.ts";

export function Largest(): ReactElement {
  const { t } = useWords("sunburst-chart");

  return (
    <SunburstChart
      caption={t("largest.caption")}
      defaultIndex={2}
      label={t("spend.label")}
      legendLabel={t("teams")}
      nodes={labelled(SPEND, (key) => t(`names.${key}`))}
      shareLabel={t("share")}
      valueLabel={t("value")}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
