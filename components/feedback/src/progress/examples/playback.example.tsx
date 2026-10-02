import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Progress from "#progress/index.ts";

export function Playback(): ReactElement {
  const { t } = useWords("progress");

  return (
    <Progress.Root max={245} size="xs" value={161}>
      <Progress.Track aria-label={t("playback")} aria-valuetext={t("played")}>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}
