import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { HistogramChart } from "#histogram-chart/index.ts";

const ORDERS = [
  14, 56, 33, 88, 46, 24, 64, 38, 151, 51, 29, 75, 42, 17, 58, 34, 93, 47, 25, 66, 38, 215, 53, 30,
  77, 43, 20, 59, 35, 100, 48, 26, 68, 39, 260, 54, 31, 80, 44, 21, 61, 36, 108, 49, 27, 70, 40,
  340, 55, 32, 84, 45, 23, 62, 37, 121, 50, 28, 72, 41,
];

export function Orders(): ReactElement {
  const { t } = useWords("histogram-chart");

  return (
    <HistogramChart
      caption={t("orders.caption")}
      color="teal"
      countLabel={t("orders.orders")}
      label={t("orders.label")}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
      values={ORDERS}
    />
  );
}
