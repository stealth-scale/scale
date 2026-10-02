import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RangeChart } from "#range-chart/index.ts";

const DAYS = [
  { average: 15, day: "2026-09-21", high: 19, low: 11 },
  { average: 16, day: "2026-09-22", high: 21, low: 12 },
  { average: 18, day: "2026-09-23", high: 22, low: 14 },
  { average: 15, day: "2026-09-24", high: 18, low: 13 },
  { average: 13, day: "2026-09-25", high: 16, low: 10 },
  { average: 13, day: "2026-09-26", high: 17, low: 9 },
  { average: 15, day: "2026-09-27", high: 20, low: 11 },
];

export function Temperature(): ReactElement {
  const { t } = useWords("range-chart");

  return (
    <RangeChart
      band={{ high: "high", key: "range", label: t("temperature.range"), low: "low" }}
      caption={t("temperature.caption")}
      categoryKey="day"
      data={DAYS}
      label={t("temperature.label")}
      labelOptions={{ timeZone: "UTC", weekday: "short" }}
      legendLabel={t("series")}
      series={[{ key: "average", label: t("temperature.average") }]}
      valueOptions={{ maximumFractionDigits: 0, style: "unit", unit: "celsius" }}
    />
  );
}
