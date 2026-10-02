import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkbar } from "#sparkbar/index.ts";

const DAYS = [6, 9, 4, 7, 11, 1, 0];

export function Replay(): ReactElement {
  const { t } = useWords("sparkbar");
  const [run, setRun] = useState(0);

  return (
    <Stack direction="row">
      <Sparkbar animate key={run} label={t("replay.label")} size="lg" values={DAYS} />
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
