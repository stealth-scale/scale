import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Progress from "#progress/index.ts";

const DONE = 62;

const PLANNED = 70;

export function Plan(): ReactElement {
  const { t } = useWords("progress");

  return (
    <Progress.Root palette={DONE < PLANNED ? "warning" : "primary"} value={DONE}>
      <Progress.Label>{t("plan.label")}</Progress.Label>
      <Progress.ValueText>{t("plan.value", { done: DONE, planned: PLANNED })}</Progress.ValueText>
      <Progress.Track aria-valuetext={t("plan.spoken", { done: DONE, planned: PLANNED })}>
        <Progress.Range />
        <Progress.Marker value={PLANNED} />
      </Progress.Track>
    </Progress.Root>
  );
}
