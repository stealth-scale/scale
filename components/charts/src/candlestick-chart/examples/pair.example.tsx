import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { CandlestickChart } from "#candlestick-chart/index.ts";

import { EURO } from "./euro.ts";

export function Pair(): ReactElement {
  const { t } = useWords("candlestick-chart");

  return (
    <CandlestickChart
      caption={t("pair.caption")}
      categoryKey="day"
      data={EURO}
      label={t("pair.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      valueOptions={{ maximumFractionDigits: 4, minimumFractionDigits: 4 }}
    />
  );
}
