import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { AreaChart } from "#area-chart/index.ts";

const HOURS = [
  [120, 40],
  [180, 55],
  [260, 90],
  [310, 140],
  [295, 180],
  [240, 150],
  [205, 95],
  [150, 60],
].map(([inbound, outbound], index) => ({
  hour: `2026-09-28T${String(index * 3).padStart(2, "0")}:00:00Z`,
  inbound,
  outbound,
}));

export function Replay(): ReactElement {
  const { t } = useWords("area-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <AreaChart
        animate
        caption={t("bandwidth.caption")}
        categoryKey="hour"
        curve="linear"
        data={HOURS}
        key={run}
        label={t("bandwidth.label")}
        labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
        legendLabel={t("series")}
        series={[
          { key: "inbound", label: t("bandwidth.inbound") },
          { key: "outbound", label: t("bandwidth.outbound") },
        ]}
        valueOptions={{ style: "unit", unit: "megabit-per-second", unitDisplay: "short" }}
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
