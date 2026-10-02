import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SankeyChart } from "#sankey-chart/index.ts";

import { named, STEPS, VISITORS } from "./visitors.ts";

export function Palette(): ReactElement {
  const { t } = useWords("sankey-chart");

  return (
    <SankeyChart
      caption={t("palette.caption")}
      flows={VISITORS}
      inflowLabel={t("in")}
      label={t("visitors.label")}
      nodes={named(STEPS, (key) => t(`names.${key}`), {
        email: "pink",
        organic: "teal",
        paid: "purple",
        social: "orange",
      })}
      outflowLabel={t("out")}
      shareLabel={t("share")}
      valueLabel={t("visitors.value")}
      values={false}
    />
  );
}
