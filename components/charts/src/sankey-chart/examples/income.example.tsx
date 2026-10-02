import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SankeyChart } from "#sankey-chart/index.ts";

import { INCOME, LINES, named } from "./visitors.ts";

export function Income(): ReactElement {
  const { t } = useWords("sankey-chart");

  return (
    <SankeyChart
      caption={t("income.caption")}
      flows={INCOME}
      inflowLabel={t("in")}
      label={t("income.label")}
      nodes={named(LINES, (key) => t(`names.${key}`))}
      outflowLabel={t("out")}
      shareLabel={t("share")}
      valueLabel={t("income.value")}
      valueOptions={{
        currency: "EUR",
        maximumFractionDigits: 1,
        notation: "compact",
        style: "currency",
      }}
    />
  );
}
