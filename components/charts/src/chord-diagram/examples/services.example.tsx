import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram } from "#chord-diagram/index.ts";
import { flowBalance } from "#sankey-chart/index.ts";

import { CALLS, named, SERVICES } from "./calls.ts";

export function Services(): ReactElement {
  const { t } = useWords("chord-diagram");
  const nodes = named(SERVICES, (key) => t(`names.${key}`));
  const [loudest] = flowBalance(nodes, CALLS).toSorted(
    (first, second) => second.outflow - first.outflow,
  );

  return (
    <ChordDiagram
      caption={t("services.caption", {
        name: t(`names.${loudest?.key ?? ""}`),
        received: loudest?.inflow,
        sent: loudest?.outflow,
      })}
      flows={CALLS}
      inflowLabel={t("in")}
      label={t("services.label")}
      nodes={nodes}
      outflowLabel={t("out")}
    />
  );
}
