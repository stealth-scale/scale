import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { PieChart } from "#pie-chart/index.ts";

export function Replay(): ReactElement {
  const { t } = useWords("pie-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <PieChart
        animate
        caption={t("plans.caption")}
        key={run}
        label={t("plans.label")}
        legendLabel={t("plans.legend")}
        slices={[
          { key: "starter", label: t("plans.starter"), value: 610 },
          { key: "growth", label: t("plans.growth"), value: 520 },
          { key: "scale", label: t("plans.scale"), value: 170 },
        ]}
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
