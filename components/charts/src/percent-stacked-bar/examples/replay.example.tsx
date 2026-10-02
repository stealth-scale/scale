import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { PercentStackedBar } from "#percent-stacked-bar/index.ts";

const REGIONS = [
  { growth: 520, region: "americas", scale: 170, starter: 610 },
  { growth: 310, region: "emea", scale: 70, starter: 420 },
  { growth: 90, region: "apac", scale: 30, starter: 180 },
];

export function Replay(): ReactElement {
  const { t } = useWords("percent-stacked-bar");
  const [run, setRun] = useState(0);
  const rows = REGIONS.map(({ growth, region, scale, starter }) => ({
    growth,
    region: t(`mix.${region}`),
    scale,
    starter,
  }));

  return (
    <Stack align="flex-start">
      <PercentStackedBar
        animate
        caption={t("mix.caption")}
        categoryKey="region"
        data={rows}
        key={run}
        label={t("mix.label")}
        legendLabel={t("series")}
        series={[
          { key: "scale", label: t("mix.scale") },
          { key: "growth", label: t("mix.growth") },
          { key: "starter", label: t("mix.starter") },
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
