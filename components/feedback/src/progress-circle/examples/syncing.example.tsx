import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as ProgressCircle from "#progress-circle/index.ts";

export function Syncing(props: ProgressCircle.RootProps): ReactElement {
  const { t } = useWords("progress-circle");

  return (
    <ProgressCircle.Root layout="inline" size="sm" value={null} {...props}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <ProgressCircle.Label>{t("syncing")}</ProgressCircle.Label>
    </ProgressCircle.Root>
  );
}
