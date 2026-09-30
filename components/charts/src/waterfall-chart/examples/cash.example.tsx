import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { WaterfallChart } from "#waterfall-chart/index.ts";

export function Cash(): ReactElement {
  const { t } = useWords("waterfall-chart");

  return (
    <WaterfallChart
      caption={t("cash.caption")}
      label={t("cash.label")}
      steps={[
        { key: "opening", label: t("cash.opening"), total: true, value: 40_000 },
        { key: "payroll", label: t("cash.payroll"), value: -85_000 },
        { key: "suppliers", label: t("cash.suppliers"), value: -30_000 },
        { key: "receipts", label: t("cash.receipts"), value: 120_000 },
        { key: "tax", label: t("cash.tax"), value: -15_000 },
        { key: "closing", label: t("cash.closing"), total: true },
      ]}
      valueLabel={t("cash.cash")}
      valueOptions={{ currency: "EUR", notation: "compact", style: "currency" }}
    />
  );
}
