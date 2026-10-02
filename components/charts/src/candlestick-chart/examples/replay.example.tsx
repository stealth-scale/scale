import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { CandlestickChart } from "#candlestick-chart/index.ts";

import { ACME } from "./acme.ts";

export function Replay(): ReactElement {
  const { t } = useWords("candlestick-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <CandlestickChart
        animate
        caption={t("daily.caption")}
        categoryKey="day"
        data={ACME}
        key={run}
        label={t("daily.label")}
        labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
        valueOptions={{ currency: "USD", style: "currency" }}
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
