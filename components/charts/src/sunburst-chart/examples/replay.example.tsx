import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { SunburstChart } from "#sunburst-chart/index.ts";

import { labelled, SPEND } from "./spend.ts";

export function Replay(): ReactElement {
  const { t } = useWords("sunburst-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <SunburstChart
        animate
        caption={t("replay.caption")}
        key={run}
        label={t("spend.label")}
        legendLabel={t("teams")}
        nodes={labelled(SPEND, (key) => t(`names.${key}`))}
        shareLabel={t("share")}
        valueLabel={t("value")}
        valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
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
