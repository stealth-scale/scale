import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { WaterfallChart } from "#waterfall-chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("waterfall-chart");

  return (
    <WaterfallChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("bridge.label")}
      steps={[]}
      valueLabel={t("bridge.mrr")}
    />
  );
}
