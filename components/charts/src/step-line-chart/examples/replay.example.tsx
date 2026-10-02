import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { StepLineChart } from "#step-line-chart/index.ts";

const READINGS = [
  [3, 2],
  [3, 2],
  [5, 2],
  [8, 4],
  [8, 6],
  [8, 6],
  [6, 6],
  [4, 4],
  [4, 2],
  [3, 2],
].map(([api, worker], index) => ({
  api,
  at: `2026-09-28T${String(12 + Math.floor(index / 6)).padStart(2, "0")}:${String((index % 6) * 10).padStart(2, "0")}:00Z`,
  worker,
}));

export function Replay(): ReactElement {
  const { t } = useWords("step-line-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <StepLineChart
        animate
        caption={t("replicas.caption")}
        categoryKey="at"
        data={READINGS}
        key={run}
        label={t("replicas.label")}
        labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
        legendLabel={t("series")}
        series={[
          { key: "api", label: t("replicas.api") },
          { key: "worker", label: t("replicas.worker") },
        ]}
        valueOptions={{ maximumFractionDigits: 0 }}
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
