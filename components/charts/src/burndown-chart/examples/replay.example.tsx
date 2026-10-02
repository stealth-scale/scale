import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { BurndownChart, burndownFinish } from "#burndown-chart/index.ts";

const POINTS = [
  { at: "2026-09-14", remaining: 60 },
  { at: "2026-09-15", remaining: 55 },
  { at: "2026-09-16", remaining: 52 },
  { at: "2026-09-17", remaining: 47 },
  { at: "2026-09-18", remaining: 44 },
  { at: "2026-09-21", remaining: 39 },
  { at: "2026-09-22", remaining: 36 },
  { at: "2026-09-23" },
  { at: "2026-09-24" },
  { at: "2026-09-25" },
];

export function Replay(): ReactElement {
  const { t } = useWords("burndown-chart");
  const [run, setRun] = useState(0);
  const finish = burndownFinish(POINTS);

  return (
    <Stack align="flex-start">
      <BurndownChart
        animate
        caption={
          finish === undefined
            ? t("stalled")
            : t("finish", { day: Math.ceil(finish) + 1, days: POINTS.length })
        }
        idealLabel={t("ideal")}
        key={run}
        label={t("sprint.label")}
        labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
        legendLabel={t("series")}
        points={POINTS}
        projectedLabel={t("projected")}
        remainingLabel={t("remaining")}
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
