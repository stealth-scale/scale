import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { NetworkGraph } from "#network-graph/index.ts";

const MODULES = ["stats", "linear", "calculus", "structures", "econometrics", "ethics"] as const;

const TAKEN_TOGETHER = [
  { source: "stats", target: "linear" },
  { source: "stats", target: "calculus" },
  { source: "stats", target: "structures" },
  { source: "stats", target: "econometrics" },
  { source: "stats", target: "ethics" },
  { source: "econometrics", target: "calculus" },
  { source: "structures", target: "linear" },
];

export function Modules(): ReactElement {
  const { t } = useWords("network-graph");
  const nodes = MODULES.map((id) => ({ id, label: t(`modules.names.${id}`) }));

  return (
    <NetworkGraph
      clearLabel={t("words.clear")}
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      focusLabel={t("words.focus")}
      label={t("modules.label")}
      links={TAKEN_TOGETHER}
      neighborLabel={t("words.connected")}
      nodeDescription={t("words.description")}
      nodes={nodes}
      promptLabel={t("modules.prompt")}
      summary={({ count, name }) => t("modules.summary", { count, name })}
    />
  );
}
