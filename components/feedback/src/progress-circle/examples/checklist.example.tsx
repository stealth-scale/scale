import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as ProgressCircle from "#progress-circle/index.ts";

const DONE = 3;

const STEPS = 5;

export function Checklist(): ReactElement {
  const { t } = useWords("progress-circle");

  return (
    <ProgressCircle.Root layout="inline" max={STEPS} palette="success" size="xl" value={DONE}>
      <ProgressCircle.Circle aria-valuetext={t("steps", { count: DONE, total: STEPS })}>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText>{`${String(DONE)}/${String(STEPS)}`}</ProgressCircle.ValueText>
      <ProgressCircle.Label>{t("checklist")}</ProgressCircle.Label>
    </ProgressCircle.Root>
  );
}
