import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as ProgressCircle from "#progress-circle/index.ts";

const USED = 7.4;

const TOTAL = 10;

export function Quota(): ReactElement {
  const { t } = useWords("progress-circle");

  return (
    <ProgressCircle.Root max={TOTAL} palette="warning" size="xl" value={USED}>
      <ProgressCircle.Circle aria-valuetext={t("quota.used", { total: TOTAL, used: USED })}>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText />
      <ProgressCircle.Label>{t("quota.label")}</ProgressCircle.Label>
    </ProgressCircle.Root>
  );
}
