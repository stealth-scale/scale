import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { ComboChart } from "#combo-chart/index.ts";

const MONTHS = [
  { margin: 0.61, month: "2026-01-01", revenue: 182_000 },
  { margin: 0.63, month: "2026-02-01", revenue: 176_000 },
  { margin: 0.6, month: "2026-03-01", revenue: 205_000 },
  { margin: 0.58, month: "2026-04-01", revenue: 214_000 },
  { margin: 0.57, month: "2026-05-01", revenue: 231_000 },
  { margin: 0.55, month: "2026-06-01", revenue: 248_000 },
  { margin: 0.56, month: "2026-07-01", revenue: 239_000 },
  { margin: 0.59, month: "2026-08-01", revenue: 226_000 },
  { margin: 0.62, month: "2026-09-01", revenue: 254_000 },
];

export function Replay(): ReactElement {
  const { t } = useWords("combo-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <ComboChart
        animate
        caption={t("revenue.caption")}
        categoryKey="month"
        data={MONTHS}
        endDomain={[0, 1]}
        endOptions={{ maximumFractionDigits: 0, style: "percent" }}
        key={run}
        label={t("revenue.label")}
        labelOptions={{ month: "short", timeZone: "UTC" }}
        legendLabel={t("series")}
        series={[
          { key: "revenue", label: t("revenue.revenue"), mark: "bar" },
          { axis: "end", key: "margin", label: t("revenue.margin"), mark: "line" },
        ]}
        valueOptions={{
          currency: "EUR",
          maximumFractionDigits: 0,
          notation: "compact",
          style: "currency",
        }}
      />
      <Button
        onClick={() => {
          setRun(run + 1);
        }}
        size="sm"
        variant="outline"
      >
        <RotateCcwIcon />
        {t("replay.replay")}
      </Button>
    </Stack>
  );
}
