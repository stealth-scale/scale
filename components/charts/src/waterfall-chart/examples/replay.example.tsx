import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { WaterfallChart } from "#waterfall-chart/index.ts";

export function Replay(): ReactElement {
  const { t } = useWords("waterfall-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <WaterfallChart
        animate
        caption={t("bridge.caption")}
        key={run}
        label={t("bridge.label")}
        steps={[
          { key: "august", label: t("bridge.august"), total: true, value: 120_000 },
          { key: "new", label: t("bridge.new"), value: 18_400 },
          { key: "expansion", label: t("bridge.expansion"), value: 9200 },
          { key: "contraction", label: t("bridge.contraction"), value: -4100 },
          { key: "churn", label: t("bridge.churn"), value: -7600 },
          { key: "september", label: t("bridge.september"), total: true },
        ]}
        valueLabel={t("bridge.mrr")}
        valueOptions={{
          currency: "EUR",
          maximumFractionDigits: 1,
          notation: "compact",
          style: "currency",
        }}
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
