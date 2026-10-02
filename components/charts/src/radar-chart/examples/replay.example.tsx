import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { RadarChart } from "#radar-chart/index.ts";

import { SCORECARD } from "./scores.ts";

export function Replay(): ReactElement {
  const { t } = useWords("radar-chart");
  const [run, setRun] = useState(0);
  const rows = SCORECARD.map(({ current, dimension, previous }) => ({
    current,
    dimension: t(`dimensions.${dimension}`),
    previous,
  }));

  return (
    <Stack align="flex-start">
      <RadarChart
        animate
        caption={t("scorecard.caption")}
        categoryKey="dimension"
        data={rows}
        key={run}
        label={t("scorecard.label")}
        series={[
          { key: "current", label: t("current") },
          { key: "previous", label: t("previous") },
        ]}
        valueDomain={[0, 10]}
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
