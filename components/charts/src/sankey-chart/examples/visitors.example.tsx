import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { flowBalance, SankeyChart } from "#sankey-chart/index.ts";

import { named, STEPS, VISITORS } from "./visitors.ts";

export function Visitors(): ReactElement {
  const { t } = useWords("sankey-chart");
  const nodes = named(STEPS, (key) => t(`names.${key}`));
  const balance = flowBalance(nodes, VISITORS);
  const into = (key: string): number => balance.find((node) => node.key === key)?.inflow ?? 0;
  const visitors = balance
    .filter((node) => node.inflow === 0)
    .reduce((sum, node) => sum + node.outflow, 0);

  return (
    <SankeyChart
      caption={t("visitors.caption", {
        signedUp: Math.round((into("signup") / visitors) * 100),
        subscribed: Math.round((into("subscribed") / into("signup")) * 100),
      })}
      flows={VISITORS}
      inflowLabel={t("in")}
      label={t("visitors.label")}
      nodes={nodes}
      outflowLabel={t("out")}
      shareLabel={t("share")}
      valueLabel={t("visitors.value")}
    />
  );
}
