import { type ReactElement, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Timer from "#timer/index.ts";

const WAIT = Timer.parse({ seconds: 30 });

export function Resend(): ReactElement {
  const { t } = useWords("timer");
  const [round, setRound] = useState(0);
  const [waiting, setWaiting] = useState(true);

  return (
    <Stack direction="row" gap="sm" wrap>
      {t("resend.wait")}
      <Timer.Root
        autoStart
        countdown
        key={round}
        onComplete={() => {
          setWaiting(false);
        }}
        size="sm"
        startMs={WAIT}
      >
        <Timer.Area>
          <Timer.Item type="minutes" />
          <Timer.Separator>:</Timer.Separator>
          <Timer.Item type="seconds" />
        </Timer.Area>
      </Timer.Root>
      <Button
        aria-disabled={waiting}
        onClick={() => {
          if (waiting) return;
          setWaiting(true);
          setRound(round + 1);
        }}
        size="sm"
        variant="outline"
      >
        {t("resend.action")}
      </Button>
    </Stack>
  );
}
