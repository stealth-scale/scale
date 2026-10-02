import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { BubbleChart } from "#bubble-chart/index.ts";

const FEATURES = [
  [0.82, 4.1, 12_400],
  [0.64, 3.8, 9700],
  [0.51, 4.4, 7700],
  [0.38, 3.2, 5800],
  [0.29, 4.6, 4400],
  [0.21, 3.5, 3200],
  [0.12, 2.9, 1800],
  [0.08, 4.2, 1200],
].map(([adoption = 0, rating = 0, users = 0]) => ({ adoption, rating, users }));

export function Replay(): ReactElement {
  const { t } = useWords("bubble-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <BubbleChart
        animate
        caption={t("features.caption")}
        key={run}
        label={t("features.label")}
        series={[{ key: "features", label: t("features.features"), points: FEATURES }]}
        sizeKey="users"
        sizeLabel={t("features.users")}
        sizeOptions={{ notation: "compact" }}
        xKey="adoption"
        xLabel={t("features.adoption")}
        xOptions={{ style: "percent" }}
        yDomain={[1, 5]}
        yKey="rating"
        yLabel={t("features.rating")}
        yOptions={{ maximumFractionDigits: 1 }}
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
