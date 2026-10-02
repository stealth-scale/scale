import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { FunnelChart } from "#funnel-chart/index.ts";

import { CHECKOUT } from "./stages.ts";

export function Replay(): ReactElement {
  const { t } = useWords("funnel-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <FunnelChart
        animate
        caption={t("replay.caption")}
        key={run}
        label={t("checkout.label")}
        overallLabel={t("overall")}
        stageLabel={t("stage")}
        stages={CHECKOUT.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }))}
        stepLabel={t("step")}
        stepsLabel={t("steps")}
        valueLabel={t("people")}
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
