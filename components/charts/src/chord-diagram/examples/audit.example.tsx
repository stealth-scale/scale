import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram } from "#chord-diagram/index.ts";
import { flowBalance } from "#sankey-chart/index.ts";

import { AUDITED, LOGGED, named } from "./calls.ts";

export function Audit(): ReactElement {
  const { t } = useWords("chord-diagram");
  const nodes = named(AUDITED, (key) => t(`names.${key}`));
  const audit = flowBalance(nodes, LOGGED).find((node) => node.key === "audit");

  return (
    <ChordDiagram
      caption={t("audit.caption", { name: t("names.audit"), received: audit?.inflow })}
      defaultIndex={14}
      flows={LOGGED}
      inflowLabel={t("in")}
      label={t("audit.label")}
      nodes={nodes}
      outflowLabel={t("out")}
    />
  );
}
