import { type ReactElement } from "react";

import { ReferenceLine } from "recharts";

import { useWords } from "@stealthscale/specimen";

import * as Chart from "#chart/index.ts";
import { LineChart } from "#line-chart/index.ts";

const DAYS = [
  { day: "2026-09-21", spend: 980 },
  { day: "2026-09-22", spend: 1340 },
  { day: "2026-09-23", spend: 1290 },
  { day: "2026-09-24", spend: 1110 },
  { day: "2026-09-25", spend: 1050 },
  { day: "2026-09-26", spend: 720 },
  { day: "2026-09-27", spend: 690 },
];

export function Budget(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      caption={t("budget.caption")}
      categoryKey="day"
      data={DAYS}
      label={t("budget.label")}
      labelOptions={{ timeZone: "UTC", weekday: "short" }}
      series={[{ key: "spend", label: t("budget.spend") }]}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    >
      <ReferenceLine
        label={{ position: "insideTopRight", value: t("budget.budget") }}
        stroke={Chart.colorOf("error")}
        strokeDasharray="6 4"
        y={1200}
      />
    </LineChart>
  );
}
