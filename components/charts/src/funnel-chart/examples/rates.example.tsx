import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { FunnelChart } from "#funnel-chart/index.ts";

import { CHECKOUT } from "./stages.ts";

export function Rates(): ReactElement {
  const { t } = useWords("funnel-chart");

  return (
    <FunnelChart
      caption={t("rates.caption")}
      defaultIndex={4}
      label={t("checkout.label")}
      overallLabel={t("overall")}
      stageLabel={t("stage")}
      stages={CHECKOUT.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }))}
      stepLabel={t("step")}
      stepsLabel={t("steps")}
      valueLabel={t("people")}
    />
  );
}
