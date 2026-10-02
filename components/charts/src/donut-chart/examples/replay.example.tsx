import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { DonutChart } from "#donut-chart/index.ts";

const KINDS = [
  { gigabytes: 118, key: "video" },
  { gigabytes: 42, key: "images" },
  { gigabytes: 26, key: "archives" },
  { gigabytes: 9.5, key: "documents" },
];

export function Replay(): ReactElement {
  const { t } = useWords("donut-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <DonutChart
        animate
        caption={t("usage.caption")}
        key={run}
        label={t("usage.label")}
        legendLabel={t("usage.legend")}
        slices={KINDS.map(({ gigabytes, key }) => ({
          key,
          label: t(`usage.${key}`),
          value: gigabytes,
        }))}
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
