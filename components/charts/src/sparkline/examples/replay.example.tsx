import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const MONTHS = [0, 40, 95, 180, 260, 410, 590, 720, 940, 1240];

export function Replay(): ReactElement {
  const { t } = useWords("sparkline");
  const [run, setRun] = useState(0);

  return (
    <Stack direction="row">
      <Sparkline animate area key={run} label={t("replay.label")} size="lg" values={MONTHS} />
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
