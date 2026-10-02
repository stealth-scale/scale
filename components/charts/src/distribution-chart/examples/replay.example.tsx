import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { DistributionChart } from "#distribution-chart/index.ts";

import { NORTH, SOUTH } from "./deliveries.ts";

export function Replay(): ReactElement {
  const { t } = useWords("distribution-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <DistributionChart
        animate
        caption={t("regions.caption")}
        key={run}
        label={t("regions.label")}
        legendLabel={t("regions.regions")}
        series={[
          { key: "north", label: t("regions.north"), values: NORTH },
          { key: "south", label: t("regions.south"), values: SOUTH },
        ]}
        valueOptions={{ style: "unit", unit: "day", unitDisplay: "narrow" }}
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
