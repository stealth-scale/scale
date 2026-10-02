import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { FunnelChart } from "#funnel-chart/index.ts";

import { ADVERT } from "./stages.ts";

export function Advert(): ReactElement {
  const { t } = useWords("funnel-chart");

  return (
    <FunnelChart
      caption={t("advert.caption")}
      label={t("advert.label")}
      overallLabel={t("overall")}
      stageLabel={t("stage")}
      stages={ADVERT.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }))}
      stepLabel={t("step")}
      stepsLabel={t("steps")}
      valueLabel={t("people")}
      valueOptions={{ notation: "compact" }}
    />
  );
}
