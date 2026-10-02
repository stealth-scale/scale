import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

import { HOURS } from "./cycles.ts";

export function Replay(): ReactElement {
  const { t } = useWords("polar-area-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <PolarAreaChart
        animate
        caption={t("requests.caption")}
        key={run}
        label={t("requests.label")}
        slices={HOURS.map(({ key, value }) => ({ key, label: t(`hours.${key}`), value }))}
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
