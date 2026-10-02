import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { StreamGraph } from "#stream-graph/index.ts";

const MONTHS = [
  [130, 82, 60, 32, 30, 50],
  [128, 85, 62, 40, 38, 45],
  [135, 88, 64, 46, 52, 42],
  [120, 80, 66, 30, 25, 40],
  [118, 82, 70, 32, 24, 45],
  [125, 78, 74, 28, 22, 52],
  [130, 75, 78, 25, 20, 60],
  [140, 72, 84, 22, 18, 72],
  [150, 70, 88, 20, 16, 85],
  [160, 68, 94, 18, 15, 95],
  [155, 70, 96, 20, 16, 90],
  [145, 74, 92, 24, 19, 75],
].map(([pop = 0, rock = 0, hiphop = 0, jazz = 0, classical = 0, electronic = 0], index) => ({
  classical,
  electronic,
  hiphop,
  jazz,
  month: new Date(Date.UTC(2025, 9 + index, 1)).toISOString().slice(0, 10),
  pop,
  rock,
}));

export function Replay(): ReactElement {
  const { t } = useWords("stream-graph");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <StreamGraph
        animate
        baseline="silhouette"
        caption={t("listening.caption")}
        categoryKey="month"
        data={MONTHS}
        key={run}
        label={t("listening.label")}
        labelOptions={{ month: "short", timeZone: "UTC" }}
        legendLabel={t("listening.genres")}
        series={[
          { key: "pop", label: t("listening.pop") },
          { key: "rock", label: t("listening.rock") },
          { key: "hiphop", label: t("listening.hiphop") },
          { key: "jazz", label: t("listening.jazz") },
          { key: "classical", label: t("listening.classical") },
          { key: "electronic", label: t("listening.electronic") },
        ]}
        valueOptions={{ style: "unit", unit: "hour", unitDisplay: "short" }}
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
