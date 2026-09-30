import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { StackedBarChart } from "#stacked-bar-chart/index.ts";

const MONTHS = [
  [2400, 6400, 9600],
  [2600, 7100, 12_000],
  [2400, 8800, 11_200],
  [2800, 9500, 16_800],
  [3000, 13_400, 20_800],
  [3000, 15_800, 24_800],
].map(([starter, growth, scale], index) => ({
  growth,
  month: `2026-0${String(4 + index)}-01`,
  scale,
  starter,
}));

export function Replay(): ReactElement {
  const { t } = useWords("stacked-bar-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <StackedBarChart
        animate
        caption={t("revenue.caption")}
        categoryKey="month"
        data={MONTHS}
        key={run}
        label={t("revenue.label")}
        labelOptions={{ month: "short", timeZone: "UTC" }}
        legendLabel={t("series")}
        series={[
          { key: "scale", label: t("revenue.scale") },
          { key: "growth", label: t("revenue.growth") },
          { key: "starter", label: t("revenue.starter") },
        ]}
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
