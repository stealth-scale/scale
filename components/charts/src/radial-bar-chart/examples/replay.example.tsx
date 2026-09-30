import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { RadialBarChart } from "#radial-bar-chart/index.ts";

import { USAGE } from "./quotas.ts";

export function Replay(): ReactElement {
  const { t } = useWords("radial-bar-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <RadialBarChart
        animate
        bars={USAGE.map(({ key, used }) => ({ key, label: t(`usage.${key}`), value: used }))}
        caption={t("usage.caption")}
        key={run}
        label={t("usage.label")}
        max={1}
        valueOptions={{ style: "percent" }}
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
