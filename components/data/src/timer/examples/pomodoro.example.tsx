import { type ReactElement, useState } from "react";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

import { Progress } from "@stealthscale/component-feedback";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Timer from "#timer/index.ts";

const FOCUS = Timer.parse({ minutes: 25 });

const BREAK = Timer.parse({ minutes: 5 });

export function Pomodoro(): ReactElement {
  const { t } = useWords("timer");
  const [resting, setResting] = useState(false);
  const [left, setLeft] = useState(FOCUS);
  const total = resting ? BREAK : FOCUS;
  const palette = resting ? "success" : "primary";

  return (
    <Stack gap="md">
      <Progress.Root max={total} palette={palette} value={total - left}>
        <Progress.Label>{t(resting ? "pomodoro.break" : "pomodoro.focus")}</Progress.Label>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Timer.Root
        countdown
        onComplete={() => {
          setLeft(resting ? FOCUS : BREAK);
          setResting(!resting);
        }}
        onTick={({ value }) => {
          setLeft(value);
        }}
        palette={palette}
        startMs={total}
      >
        <Timer.Area>
          <Timer.Item type="minutes" />
          <Timer.Separator>:</Timer.Separator>
          <Timer.Item type="seconds" />
        </Timer.Area>
        <Timer.Control>
          <Timer.ActionTrigger action="start">
            <PlayIcon />
            {t("start")}
          </Timer.ActionTrigger>
          <Timer.ActionTrigger action="pause">
            <PauseIcon />
            {t("pause")}
          </Timer.ActionTrigger>
          <Timer.ActionTrigger action="resume">
            <PlayIcon />
            {t("resume")}
          </Timer.ActionTrigger>
          <Timer.ActionTrigger action="restart" variant="outline">
            <RotateCcwIcon />
            {t("restart")}
          </Timer.ActionTrigger>
        </Timer.Control>
      </Timer.Root>
    </Stack>
  );
}
