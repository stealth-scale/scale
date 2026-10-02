import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { CandlestickChart } from "#candlestick-chart/index.ts";

const DAYS: Array<{ close: number; day: string; high: number; low: number; open: number }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("candlestick-chart");

  return (
    <CandlestickChart
      caption={t("quiet.caption")}
      categoryKey="day"
      data={DAYS}
      empty={t("quiet.empty")}
      label={t("daily.label")}
    />
  );
}
