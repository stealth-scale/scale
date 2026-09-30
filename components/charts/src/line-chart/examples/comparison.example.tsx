import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { alignPeriods } from "#cartesian/index.ts";
import { LineChart } from "#line-chart/index.ts";

const THIS_WEEK = [18_200, 21_400, 20_100, 24_800, 26_300, 15_900, 14_700].map(
  (revenue, index) => ({ day: `2026-09-${String(index + 21)}`, revenue }),
);

const LAST_WEEK = [16_900, 19_800, 20_600, 22_100, 24_300, 16_400, 13_200].map(
  (revenue, index) => ({ day: `2026-09-${String(index + 14)}`, revenue }),
);

const DAYS = alignPeriods(THIS_WEEK, LAST_WEEK, { categoryKey: "day", keys: ["revenue"] });

export function Comparison(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      caption={t("comparison.caption")}
      categoryKey="day"
      data={DAYS}
      defaultIndex={4}
      label={t("revenue.label")}
      labelOptions={{ timeZone: "UTC", weekday: "short" }}
      legendLabel={t("comparison.weeks")}
      series={[
        { key: "revenue", label: t("comparison.current") },
        { key: "revenuePrevious", label: t("comparison.previous"), previousOf: "revenue" },
      ]}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
