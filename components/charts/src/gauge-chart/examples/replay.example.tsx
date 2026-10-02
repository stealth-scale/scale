import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { GaugeChart } from "#gauge-chart/index.ts";

import { BUDGET_MAX, LATENCY } from "./readings.ts";

export function Replay(): ReactElement {
  const { t } = useWords("gauge-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <GaugeChart
        animate
        caption={t("latency.caption")}
        key={run}
        label={t("latency.label")}
        max={BUDGET_MAX}
        value={740}
        valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
        zones={LATENCY.map(({ color, key, upTo }) => ({ color, label: t(`zones.${key}`), upTo }))}
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
