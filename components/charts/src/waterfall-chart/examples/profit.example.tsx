import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { WaterfallChart } from "#waterfall-chart/index.ts";

export function Profit(): ReactElement {
  const { t } = useWords("waterfall-chart");

  return (
    <WaterfallChart
      caption={t("profit.caption")}
      label={t("profit.label")}
      steps={[
        { key: "revenue", label: t("profit.revenue"), value: 480_000 },
        { key: "cost", label: t("profit.cost"), value: -190_000 },
        { key: "gross", label: t("profit.gross"), total: true },
        { key: "expenses", label: t("profit.expenses"), value: -225_000 },
        { key: "operating", label: t("profit.operating"), total: true },
      ]}
      valueLabel={t("profit.amount")}
      valueOptions={{ currency: "EUR", notation: "compact", style: "currency" }}
    />
  );
}
