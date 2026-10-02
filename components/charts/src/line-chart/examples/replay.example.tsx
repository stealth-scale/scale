import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const DAYS = [
  { day: "2026-09-21", revenue: 18_200 },
  { day: "2026-09-22", revenue: 21_400 },
  { day: "2026-09-23", revenue: 20_100 },
  { day: "2026-09-24", revenue: 24_800 },
  { day: "2026-09-25", revenue: 26_300 },
  { day: "2026-09-26", revenue: 15_900 },
  { day: "2026-09-27", revenue: 14_700 },
];

export function Replay(): ReactElement {
  const { t } = useWords("line-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <LineChart
        animate
        caption={t("revenue.caption")}
        categoryKey="day"
        data={DAYS}
        key={run}
        label={t("revenue.label")}
        labelOptions={{ timeZone: "UTC", weekday: "short" }}
        series={[{ key: "revenue", label: t("revenue.revenue") }]}
        valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
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
