import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DirectedGraph } from "#directed-graph/index.ts";

export function Empty(): ReactElement {
  const { t } = useWords("directed-graph");

  return (
    <DirectedGraph
      edges={[]}
      emptyLabel={t("empty.message")}
      label={t("empty.label")}
      nodes={[]}
      ratio="wide"
    />
  );
}
