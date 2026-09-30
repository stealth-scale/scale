import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ComboChart } from "#combo-chart/index.ts";

const ORDERS = [412, 438, 451, 429, 470, 318, 296, 425, 447, 462, 441, 488, 331, 305];

const DAYS = ORDERS.map((orders, index) => ({
  average:
    index < 6
      ? undefined
      : Math.round(ORDERS.slice(index - 6, index + 1).reduce((sum, each) => sum + each, 0) / 7),
  day: `2026-09-${String(14 + index)}`,
  orders,
}));

export function Orders(): ReactElement {
  const { t } = useWords("combo-chart");

  return (
    <ComboChart
      caption={t("orders.caption")}
      categoryKey="day"
      curve="linear"
      data={DAYS}
      label={t("orders.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      legendLabel={t("series")}
      series={[
        { key: "orders", label: t("orders.orders"), mark: "bar" },
        { key: "average", label: t("orders.average"), mark: "line" },
      ]}
    />
  );
}
