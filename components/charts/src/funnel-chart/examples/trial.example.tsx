import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { FunnelChart } from "#funnel-chart/index.ts";

import { TRIAL } from "./stages.ts";

export function Trial(): ReactElement {
  const { t } = useWords("funnel-chart");

  return (
    <FunnelChart
      caption={t("trial.caption")}
      label={t("trial.label")}
      overallLabel={t("overall")}
      stageLabel={t("stage")}
      stages={TRIAL.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }))}
      stepLabel={t("step")}
      stepsLabel={t("steps")}
      valueLabel={t("accounts")}
    />
  );
}
