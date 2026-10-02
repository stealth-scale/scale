import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Progress from "#progress/index.ts";

export function Reconciling(props: Progress.RootProps): ReactElement {
  const { t } = useWords("progress");

  return (
    <Progress.Root value={62} {...props}>
      <Progress.Label>{t("reconciling")}</Progress.Label>
      <Progress.ValueText />
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}
