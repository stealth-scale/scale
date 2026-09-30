import { type ReactElement } from "react";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Timer from "#timer/index.ts";

export function Stopwatch(): ReactElement {
  const { t } = useWords("timer");

  return (
    <Timer.Root interval={10}>
      <Timer.Area>
        <Timer.Item type="minutes" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="seconds" />
        <Timer.Separator>.</Timer.Separator>
        <Timer.Item type="milliseconds" />
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
        <Timer.ActionTrigger action="reset" variant="outline">
          <RotateCcwIcon />
          {t("reset")}
        </Timer.ActionTrigger>
      </Timer.Control>
    </Timer.Root>
  );
}
