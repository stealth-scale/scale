import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { BarChart } from "#bar-chart/index.ts";

const MONTHS = [
  [120, 64, 12],
  [132, 71, 15],
  [118, 88, 14],
  [141, 95, 21],
  [150, 134, 26],
  [152, 158, 31],
].map(([starter, growth, scale], index) => ({
  growth,
  month: `2026-0${String(4 + index)}-01`,
  scale,
  starter,
}));

export function Replay(): ReactElement {
  const { t } = useWords("bar-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <BarChart
        animate
        caption={t("signups.caption")}
        categoryKey="month"
        data={MONTHS}
        key={run}
        label={t("signups.label")}
        labelOptions={{ month: "short", timeZone: "UTC" }}
        legendLabel={t("series")}
        series={[
          { key: "starter", label: t("signups.starter") },
          { key: "growth", label: t("signups.growth") },
          { key: "scale", label: t("signups.scale") },
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
