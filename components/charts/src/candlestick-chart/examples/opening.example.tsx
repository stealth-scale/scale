import { type ReactElement } from "react";

import { ReferenceLine } from "recharts";

import { useWords } from "@stealthscale/specimen";

import { CandlestickChart } from "#candlestick-chart/index.ts";
import * as Chart from "#chart/index.ts";

import { ACME } from "./acme.ts";

export function Opening(): ReactElement {
  const { t } = useWords("candlestick-chart");

  return (
    <CandlestickChart
      caption={t("opening.caption")}
      categoryKey="day"
      data={ACME}
      label={t("daily.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      valueOptions={{ currency: "USD", style: "currency" }}
    >
      <ReferenceLine
        label={{ position: "insideTopRight", value: t("opening.open") }}
        stroke={Chart.colorOf("neutral")}
        strokeDasharray="6 4"
        y={156.22}
      />
    </CandlestickChart>
  );
}
