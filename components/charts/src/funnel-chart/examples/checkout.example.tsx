import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { biggestDrop, FunnelChart, funnelSteps } from "#funnel-chart/index.ts";

import { CHECKOUT } from "./stages.ts";

export function Checkout(): ReactElement {
  const { t } = useWords("funnel-chart");
  const stages = CHECKOUT.map(({ key, value }) => ({ key, label: t(`stages.${key}`), value }));
  const worst = biggestDrop(funnelSteps(stages));

  return (
    <FunnelChart
      caption={
        worst &&
        t("checkout.caption", { lost: worst.dropped, stage: t(`stages.${worst.stage.key}`) })
      }
      label={t("checkout.label")}
      overallLabel={t("overall")}
      stageLabel={t("stage")}
      stages={stages}
      stepLabel={t("step")}
      stepsLabel={t("steps")}
      valueLabel={t("people")}
    />
  );
}
