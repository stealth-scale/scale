import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { FunnelChart, funnelWidenings } from "#funnel-chart/index.ts";

import { WIDENING } from "./stages.ts";

export function Widening(): ReactElement {
  const { t } = useWords("funnel-chart");
  const stages = WIDENING.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }));
  const widened = funnelWidenings(stages).map((stage) => t(`stages.${stage.key}`));

  return (
    <FunnelChart
      caption={t("widening.caption", { stages: widened.join(", ") })}
      label={t("widening.label")}
      overallLabel={t("overall")}
      stageLabel={t("stage")}
      stages={stages}
      stepLabel={t("step")}
      stepsLabel={t("steps")}
      valueLabel={t("people")}
    />
  );
}
