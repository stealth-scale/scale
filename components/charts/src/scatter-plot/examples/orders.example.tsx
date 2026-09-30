import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ScatterPlot } from "#scatter-plot/index.ts";

const ORDERS = [
  [1, 22],
  [1, 19],
  [2, 41],
  [2, 35],
  [2, 48],
  [3, 52],
  [3, 61],
  [3, 57],
  [4, 70],
  [4, 82],
  [4, 66],
  [5, 95],
  [5, 88],
  [5, 101],
  [6, 104],
  [6, 119],
  [6, 97],
  [7, 131],
  [7, 122],
  [8, 140],
  [8, 151],
  [8, 136],
  [9, 168],
  [9, 158],
  [10, 172],
  [10, 190],
  [11, 197],
  [11, 184],
  [12, 215],
  [12, 206],
].map(([items = 0, value = 0]) => ({ items, value }));

export function Orders(): ReactElement {
  const { t } = useWords("scatter-plot");

  return (
    <ScatterPlot
      caption={t("orders.caption")}
      label={t("orders.label")}
      series={[{ key: "orders", label: t("orders.orders"), points: ORDERS }]}
      size={30}
      xKey="items"
      xLabel={t("orders.items")}
      yKey="value"
      yLabel={t("orders.value")}
      yOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
