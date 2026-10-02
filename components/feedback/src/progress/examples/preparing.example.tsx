import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Progress from "#progress/index.ts";

export function Preparing(props: Progress.RootProps): ReactElement {
  const { t } = useWords("progress");

  return (
    <Progress.Root value={null} {...props}>
      <Progress.Label>{t("preparing")}</Progress.Label>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}
