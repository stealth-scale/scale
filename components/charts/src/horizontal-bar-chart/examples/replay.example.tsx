import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { HorizontalBarChart } from "#horizontal-bar-chart/index.ts";

const COUNTRIES = [
  { country: "us", sessions: 48_200 },
  { country: "gb", sessions: 21_400 },
  { country: "de", sessions: 17_900 },
  { country: "nl", sessions: 12_300 },
  { country: "br", sessions: 9800 },
  { country: "in", sessions: 8600 },
];

export function Replay(): ReactElement {
  const { t } = useWords("horizontal-bar-chart");
  const [run, setRun] = useState(0);
  const rows = COUNTRIES.map(({ country, sessions }) => ({
    country: t(`countries.${country}`),
    sessions,
  }));

  return (
    <Stack align="flex-start">
      <HorizontalBarChart
        animate
        caption={t("countries.caption")}
        categoryKey="country"
        data={rows}
        key={run}
        label={t("countries.label")}
        series={[{ color: "indigo", key: "sessions", label: t("countries.sessions") }]}
        valueOptions={{ notation: "compact" }}
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
