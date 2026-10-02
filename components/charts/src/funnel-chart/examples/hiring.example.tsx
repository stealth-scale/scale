import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { FunnelChart } from "#funnel-chart/index.ts";

import { HIRING } from "./stages.ts";

export function Hiring(): ReactElement {
  const { t } = useWords("funnel-chart");

  return (
    <FunnelChart
      caption={t("hiring.caption")}
      color="teal"
      label={t("hiring.label")}
      overallLabel={t("overall")}
      stageLabel={t("stage")}
      stages={HIRING.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }))}
      stepLabel={t("step")}
      stepsLabel={t("steps")}
      valueLabel={t("people")}
      values={false}
    />
  );
}
