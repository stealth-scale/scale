import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { WaterfallChart } from "#waterfall-chart/index.ts";

export function Bridge(): ReactElement {
  const { t } = useWords("waterfall-chart");

  return (
    <WaterfallChart
      caption={t("bridge.caption")}
      label={t("bridge.label")}
      steps={[
        { key: "august", label: t("bridge.august"), total: true, value: 120_000 },
        { key: "new", label: t("bridge.new"), value: 18_400 },
        { key: "expansion", label: t("bridge.expansion"), value: 9200 },
        { key: "contraction", label: t("bridge.contraction"), value: -4100 },
        { key: "churn", label: t("bridge.churn"), value: -7600 },
        { key: "september", label: t("bridge.september"), total: true },
      ]}
      valueLabel={t("bridge.mrr")}
      valueOptions={{
        currency: "EUR",
        maximumFractionDigits: 1,
        notation: "compact",
        style: "currency",
      }}
    />
  );
}
