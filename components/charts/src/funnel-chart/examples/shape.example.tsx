import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { FunnelChart } from "#funnel-chart/index.ts";

import { CHECKOUT } from "./stages.ts";

export function Shape(): ReactElement {
  const { t } = useWords("funnel-chart");

  return (
    <FunnelChart
      caption={t("shape.caption")}
      label={t("checkout.label")}
      overallLabel={t("overall")}
      stageLabel={t("stage")}
      stages={CHECKOUT.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }))}
      stepLabel={t("step")}
      steps={false}
      valueLabel={t("people")}
    />
  );
}
