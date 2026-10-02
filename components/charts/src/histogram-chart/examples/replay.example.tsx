import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { HistogramChart } from "#histogram-chart/index.ts";

import { LATENCIES } from "./latencies.ts";

export function Replay(): ReactElement {
  const { t } = useWords("histogram-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <HistogramChart
        animate
        caption={t("latency.caption")}
        countLabel={t("requests")}
        key={run}
        label={t("latency.label")}
        valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
        values={LATENCIES}
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
