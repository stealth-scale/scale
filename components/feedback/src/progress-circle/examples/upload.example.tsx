import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as ProgressCircle from "#progress-circle/index.ts";

export function Upload(props: ProgressCircle.RootProps): ReactElement {
  const { t } = useWords("progress-circle");

  return (
    <ProgressCircle.Root size="lg" value={62} {...props}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText />
      <ProgressCircle.Label>{t("upload")}</ProgressCircle.Label>
    </ProgressCircle.Root>
  );
}
