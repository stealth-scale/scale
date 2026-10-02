import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
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

export function Replay(): ReactElement {
  const { t } = useWords("range-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <RangeChart
        animate
        band={{ high: "high", key: "range", label: t("temperature.range"), low: "low" }}
        caption={t("temperature.caption")}
        categoryKey="day"
        data={DAYS}
        key={run}
        label={t("temperature.label")}
        labelOptions={{ timeZone: "UTC", weekday: "short" }}
        legendLabel={t("series")}
        series={[{ key: "average", label: t("temperature.average") }]}
        valueOptions={{ maximumFractionDigits: 0, style: "unit", unit: "celsius" }}
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
