import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { CandlestickChart } from "#candlestick-chart/index.ts";

import { ACME } from "./acme.ts";

export function Busiest(): ReactElement {
  const { t } = useWords("candlestick-chart");

  return (
    <CandlestickChart
      caption={t("busiest.caption")}
      categoryKey="day"
      data={ACME}
      defaultIndex={18}
      label={t("daily.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      valueOptions={{ currency: "USD", style: "currency" }}
    />
  );
}
