import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { flowBalance, SankeyChart } from "#sankey-chart/index.ts";

import { LEAKY, named, QUEUE } from "./visitors.ts";

export function Leak(): ReactElement {
  const { t } = useWords("sankey-chart");
  const nodes = named(QUEUE, (key) => t(`names.${key}`));
  const leak = flowBalance(nodes, LEAKY).find(
    (node) => node.outflow > 0 && node.inflow > node.outflow,
  );

  return (
    <SankeyChart
      caption={
        leak &&
        t("leak.caption", { lost: leak.inflow - leak.outflow, name: t(`names.${leak.key}`) })
      }
      flows={LEAKY}
      inflowLabel={t("in")}
      label={t("leak.label")}
      nodes={nodes}
      outflowLabel={t("out")}
      shareLabel={t("share")}
      valueLabel={t("leak.value")}
    />
  );
}
